create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, email_verified)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'),
    coalesce(new.email_confirmed_at is not null, false)
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name),
        email_verified = coalesce(excluded.email_verified, public.profiles.email_verified),
        updated_at = now();
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
grant execute on function public.handle_new_user() to postgres, service_role;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_auth_user_created'
      and tgrelid = 'auth.users'::regclass
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end
$$;

create or replace function public.sync_profile_email_verification()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
     set email = new.email,
         email_verified = (new.email_confirmed_at is not null),
         updated_at = now()
   where id = new.id;
  return new;
end;
$$;

revoke all on function public.sync_profile_email_verification() from public;
grant execute on function public.sync_profile_email_verification() to postgres, service_role;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'on_auth_user_email_verification_changed'
      and tgrelid = 'auth.users'::regclass
  ) then
    create trigger on_auth_user_email_verification_changed
      after update of email, email_confirmed_at on auth.users
      for each row execute function public.sync_profile_email_verification();
  end if;
end
$$;
