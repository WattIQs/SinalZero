-- SinalZero core schema
-- Canonical migration for the clean SinalZero Supabase project.

create extension if not exists pgcrypto;

create type public.organization_role as enum ('owner', 'admin', 'manager', 'viewer');

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
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name),
  unique (organization_id, code)
);

create table public.meters (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units(id) on delete cascade,
  name text not null,
  identifier text,
  meter_type text,
  active boolean not null default true,
  installed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, name),
  unique (unit_id, identifier)
);

create table public.energy_readings (
  id bigint generated always as identity primary key,
  meter_id uuid not null references public.meters(id) on delete cascade,
  recorded_at timestamptz not null,
  consumption_kwh numeric(18,6) not null,
  demand_kw numeric(18,6),
  source text,
  created_at timestamptz not null default now(),
  unique (meter_id, recorded_at),
  constraint energy_readings_consumption_nonnegative check (consumption_kwh >= 0),
  constraint energy_readings_demand_nonnegative check (demand_kw is null or demand_kw >= 0)
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  meter_id uuid references public.meters(id) on delete cascade,
  alert_type text not null,
  severity text not null default 'info',
  title text not null,
  description text,
  occurred_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  acknowledged_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index organization_members_user_idx on public.organization_members(user_id);
create index units_organization_idx on public.units(organization_id);
create index meters_unit_idx on public.meters(unit_id);
create index readings_meter_time_idx on public.energy_readings(meter_id, recorded_at desc);
create index alerts_organization_time_idx on public.alerts(organization_id, occurred_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger organizations_set_updated_at before update on public.organizations
for each row execute function public.set_updated_at();
create trigger units_set_updated_at before update on public.units
for each row execute function public.set_updated_at();
create trigger meters_set_updated_at before update on public.meters
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name')
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name),
        updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.units enable row level security;
alter table public.meters enable row level security;
alter table public.energy_readings enable row level security;
alter table public.alerts enable row level security;

create schema if not exists private;

create or replace function private.is_org_member(target_org uuid)
returns boolean
language sql
security definer
set search_path = public, private
stable
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_org and user_id = auth.uid()
  );
$$;

create or replace function private.has_org_role(target_org uuid, allowed_roles public.organization_role[])
returns boolean
language sql
security definer
set search_path = public, private
stable
as $$
  select exists (
    select 1 from public.organization_members
    where organization_id = target_org
      and user_id = auth.uid()
      and role = any(allowed_roles)
  );
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function private.is_org_member(uuid) from public, anon, authenticated;
revoke all on function private.has_org_role(uuid, public.organization_role[]) from public, anon, authenticated;

grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.has_org_role(uuid, public.organization_role[]) to authenticated;

create policy profiles_select_own on public.profiles
for select to authenticated using (id = auth.uid());
create policy profiles_update_own on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy organizations_select_member on public.organizations
for select to authenticated using (private.is_org_member(id));

create policy organizations_update_admin on public.organizations
for update to authenticated
using (private.has_org_role(id, array['owner','admin']::public.organization_role[]))
with check (private.has_org_role(id, array['owner','admin']::public.organization_role[]));

create policy organization_members_select_member on public.organization_members
for select to authenticated using (private.is_org_member(organization_id));

create policy organization_members_insert_admin on public.organization_members
for insert to authenticated
with check (private.has_org_role(organization_id, array['owner','admin']::public.organization_role[]));

create policy organization_members_update_admin on public.organization_members
for update to authenticated
using (private.has_org_role(organization_id, array['owner','admin']::public.organization_role[]))
with check (private.has_org_role(organization_id, array['owner','admin']::public.organization_role[]));

create policy units_select_member on public.units
for select to authenticated using (private.is_org_member(organization_id));
create policy units_insert_manager on public.units
for insert to authenticated
with check (private.has_org_role(organization_id, array['owner','admin','manager']::public.organization_role[]));
create policy units_update_manager on public.units
for update to authenticated
using (private.has_org_role(organization_id, array['owner','admin','manager']::public.organization_role[]))
with check (private.has_org_role(organization_id, array['owner','admin','manager']::public.organization_role[]));
create policy units_delete_admin on public.units
for delete to authenticated
using (private.has_org_role(organization_id, array['owner','admin']::public.organization_role[]));

create policy meters_select_member on public.meters
for select to authenticated using (exists (select 1 from public.units u where u.id = unit_id and private.is_org_member(u.organization_id)));
create policy meters_insert_manager on public.meters
for insert to authenticated with check (exists (select 1 from public.units u where u.id = unit_id and private.has_org_role(u.organization_id, array['owner','admin','manager']::public.organization_role[])));
create policy meters_update_manager on public.meters
for update to authenticated using (exists (select 1 from public.units u where u.id = unit_id and private.has_org_role(u.organization_id, array['owner','admin','manager']::public.organization_role[]))) with check (exists (select 1 from public.units u where u.id = unit_id and private.has_org_role(u.organization_id, array['owner','admin','manager']::public.organization_role[])));
create policy meters_delete_admin on public.meters
for delete to authenticated using (exists (select 1 from public.units u where u.id = unit_id and private.has_org_role(u.organization_id, array['owner','admin']::public.organization_role[])));

create policy readings_select_member on public.energy_readings
for select to authenticated using (exists (select 1 from public.meters m join public.units u on u.id=m.unit_id where m.id=meter_id and private.is_org_member(u.organization_id)));
create policy readings_insert_manager on public.energy_readings
for insert to authenticated with check (exists (select 1 from public.meters m join public.units u on u.id=m.unit_id where m.id=meter_id and private.has_org_role(u.organization_id, array['owner','admin','manager']::public.organization_role[])));

create policy alerts_select_member on public.alerts
for select to authenticated using (private.is_org_member(organization_id));
create policy alerts_update_manager on public.alerts
for update to authenticated using (private.has_org_role(organization_id, array['owner','admin','manager']::public.organization_role[])) with check (private.has_org_role(organization_id, array['owner','admin','manager']::public.organization_role[]));
