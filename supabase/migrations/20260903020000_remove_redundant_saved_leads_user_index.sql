-- The composite (user_id, saved_at DESC) index serves the saved-leads sync query.
-- Keep only that index instead of a redundant user_id-only index.
drop index if exists public.saved_leads_user_id_idx;
