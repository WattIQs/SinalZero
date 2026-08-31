create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type public.organization_role as enum ('owner','admin','manager','viewer');

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_role not null default 'viewer',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text,
  address text,
  city text,
  state text,
  timezone text not null default 'America/Sao_Paulo',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table public.meters (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  name text not null,
  code text,
  serial_number text,
  active boolean not null default true,
  installed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, code)
);

create type public.energy_reading_source as enum ('meter','import','manual');
create table public.energy_readings (
  id bigint generated always as identity primary key,
  meter_id uuid not null references public.meters(id) on delete cascade,
  measured_at timestamptz not null,
  consumption_kwh numeric(18,6) not null check (consumption_kwh >= 0),
  demand_kw numeric(18,6) check (demand_kw >= 0),
  source public.energy_reading_source not null default 'meter',
  created_at timestamptz not null default now(),
  unique (meter_id, measured_at)
);

create type public.alert_severity as enum ('info','warning','critical');
create type public.alert_status as enum ('open','acknowledged','resolved');
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  meter_id uuid references public.meters(id) on delete cascade,
  severity public.alert_severity not null,
  status public.alert_status not null default 'open',
  title text not null,
  description text,
  detected_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index organization_members_user_idx on public.organization_members(user_id);
create index units_organization_idx on public.units(organization_id);
create index meters_unit_idx on public.meters(unit_id);
create index energy_readings_meter_time_idx on public.energy_readings(meter_id, measured_at desc);
create index alerts_organization_time_idx on public.alerts(organization_id, detected_at desc);
create index alerts_unit_time_idx on public.alerts(unit_id, detected_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path=public as $$
begin new.updated_at=now(); return new; end; $$;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger organizations_set_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger units_set_updated_at before update on public.units for each row execute function public.set_updated_at();
create trigger meters_set_updated_at before update on public.meters for each row execute function public.set_updated_at();
create trigger alerts_set_updated_at before update on public.alerts for each row execute function public.set_updated_at();

create or replace function public.is_org_member(target_org uuid) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.organization_members om where om.organization_id=target_org and om.user_id=(select auth.uid())); $$;
create or replace function public.has_org_role(target_org uuid,allowed_roles public.organization_role[]) returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.organization_members om where om.organization_id=target_org and om.user_id=(select auth.uid()) and om.role=any(allowed_roles)); $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,email,display_name) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'display_name',new.raw_user_meta_data->>'full_name')) on conflict(id) do update set email=excluded.email; return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.units enable row level security;
alter table public.meters enable row level security;
alter table public.energy_readings enable row level security;
alter table public.alerts enable row level security;

create policy profiles_select_own on public.profiles for select to authenticated using ((select auth.uid())=id);
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
create policy organizations_select_member on public.organizations for select to authenticated using (public.is_org_member(id));
create policy organizations_insert_authenticated on public.organizations for insert to authenticated with check ((select auth.uid()) is not null);
create policy organizations_update_admin on public.organizations for update to authenticated using (public.has_org_role(id,array['owner','admin']::public.organization_role[])) with check (public.has_org_role(id,array['owner','admin']::public.organization_role[]));
create policy organization_members_select_member on public.organization_members for select to authenticated using (public.is_org_member(organization_id));
create policy organization_members_insert_admin on public.organization_members for insert to authenticated with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy organization_members_update_admin on public.organization_members for update to authenticated using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy organization_members_delete_admin on public.organization_members for delete to authenticated using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy units_select_member on public.units for select to authenticated using (public.is_org_member(organization_id));
create policy units_insert_manager on public.units for insert to authenticated with check (public.has_org_role(organization_id,array['owner','admin','manager']::public.organization_role[]));
create policy units_update_manager on public.units for update to authenticated using (public.has_org_role(organization_id,array['owner','admin','manager']::public.organization_role[])) with check (public.has_org_role(organization_id,array['owner','admin','manager']::public.organization_role[]));
create policy units_delete_admin on public.units for delete to authenticated using (public.has_org_role(organization_id,array['owner','admin']::public.organization_role[]));
create policy meters_select_member on public.meters for select to authenticated using (exists(select 1 from public.units u where u.id=unit_id and public.is_org_member(u.organization_id)));
create policy meters_insert_manager on public.meters for insert to authenticated with check (exists(select 1 from public.units u where u.id=unit_id and public.has_org_role(u.organization_id,array['owner','admin','manager']::public.organization_role[])));
create policy meters_update_manager on public.meters for update to authenticated using (exists(select 1 from public.units u where u.id=unit_id and public.has_org_role(u.organization_id,array['owner','admin','manager']::public.organization_role[]))) with check (exists(select 1 from public.units u where u.id=unit_id and public.has_org_role(u.organization_id,array['owner','admin','manager']::public.organization_role[])));
create policy meters_delete_admin on public.meters for delete to authenticated using (exists(select 1 from public.units u where u.id=unit_id and public.has_org_role(u.organization_id,array['owner','admin']::public.organization_role[])));
create policy energy_readings_select_member on public.energy_readings for select to authenticated using (exists(select 1 from public.meters m join public.units u on u.id=m.unit_id where m.id=meter_id and public.is_org_member(u.organization_id)));
create policy energy_readings_insert_manager on public.energy_readings for insert to authenticated with check (exists(select 1 from public.meters m join public.units u on u.id=m.unit_id where m.id=meter_id and public.has_org_role(u.organization_id,array['owner','admin','manager']::public.organization_role[])));
create policy energy_readings_update_manager on public.energy_readings for update to authenticated using (exists(select 1 from public.meters m join public.units u on u.id=m.unit_id where m.id=meter_id and public.has_org_role(u.organization_id,array['owner','admin','manager']::public.organization_role[]))) with check (exists(select 1 from public.meters m join public.units u on u.id=m.unit_id where m.id=meter_id and public.has_org_role(u.organization_id,array['owner','admin','manager']::public.organization_role[])));
create policy energy_readings_delete_admin on public.energy_readings for delete to authenticated using (exists(select 1 from public.meters m join public.units u on u.id=m.unit_id where m.id=meter_id and public.has_org_role(u.organization_id,array['owner','admin']::public.organization_role[])));
create policy alerts_select_member on public.alerts for select to authenticated using (public.is_org_member(organization_id));
create policy alerts_update_member on public.alerts for update to authenticated using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
