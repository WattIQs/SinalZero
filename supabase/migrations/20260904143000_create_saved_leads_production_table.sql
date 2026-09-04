-- Persistência de leads salvos para o projeto Supabase usado em produção.
-- Mantém os dados isolados por usuário autenticado via RLS.
create table if not exists public.saved_leads (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_id text not null,
  lead_data jsonb not null,
  saved_at timestamptz not null default now(),
  constraint saved_leads_user_lead_unique unique (user_id, lead_id),
  constraint saved_leads_lead_id_not_blank check (char_length(btrim(lead_id)) between 1 and 160),
  constraint saved_leads_lead_data_is_object check (jsonb_typeof(lead_data) = 'object'),
  constraint saved_leads_lead_data_max_size check (octet_length(lead_data::text) <= 65536)
);

create index if not exists saved_leads_user_saved_at_idx
  on public.saved_leads(user_id, saved_at desc);

alter table public.saved_leads enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'saved_leads' and policyname = 'Users can read own saved leads') then
    create policy "Users can read own saved leads" on public.saved_leads for select to authenticated using ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'saved_leads' and policyname = 'Users can insert own saved leads') then
    create policy "Users can insert own saved leads" on public.saved_leads for insert to authenticated with check ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'saved_leads' and policyname = 'Users can update own saved leads') then
    create policy "Users can update own saved leads" on public.saved_leads for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'saved_leads' and policyname = 'Users can delete own saved leads') then
    create policy "Users can delete own saved leads" on public.saved_leads for delete to authenticated using ((select auth.uid()) = user_id);
  end if;
end $$;

grant select, insert, update, delete on table public.saved_leads to authenticated;