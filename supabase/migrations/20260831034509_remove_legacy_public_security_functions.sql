revoke execute on function public.handle_new_user() from public,anon,authenticated;
drop function if exists public.handle_new_user();
revoke execute on function public.rls_auto_enable() from public,anon,authenticated;
