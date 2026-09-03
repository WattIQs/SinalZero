-- Keep trigger-only helpers out of the Data API.
-- This function is invoked by auth.users triggers and must not be callable as RPC.
revoke execute on function public.sync_profile_email_verification() from public, anon, authenticated;

-- The browser only needs CRUD on its own saved_leads rows; RLS enforces ownership.
revoke all on table public.saved_leads from anon, authenticated;
grant select, insert, update, delete on table public.saved_leads to authenticated;

-- Profiles are read-only projections of Auth data for signed-in owners.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

-- Verification-code hashes remain accessible only to trusted server-side functions.
revoke all on table public.email_verification_codes from anon, authenticated;

-- Bound user-controlled JSON written directly through the browser API.
alter table public.saved_leads
  add constraint saved_leads_lead_id_not_blank
    check (char_length(btrim(lead_id)) between 1 and 160),
  add constraint saved_leads_lead_data_is_object
    check (jsonb_typeof(lead_data) = 'object'),
  add constraint saved_leads_lead_data_max_size
    check (octet_length(lead_data::text) <= 65536);
