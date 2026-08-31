create or replace function public.create_organization(p_name text,p_legal_name text default null)
returns public.organizations
language plpgsql
security definer
set search_path=public
as $$
declare new_org public.organizations; current_user_id uuid := (select auth.uid());
begin
 if current_user_id is null then raise exception 'authentication required'; end if;
 if nullif(trim(p_name),'') is null then raise exception 'organization name is required'; end if;
 insert into public.organizations(name,legal_name) values(trim(p_name),nullif(trim(p_legal_name),'')) returning * into new_org;
 insert into public.organization_members(organization_id,user_id,role) values(new_org.id,current_user_id,'owner');
 return new_org;
end;
$$;
revoke execute on function public.create_organization(text,text) from public,anon;
grant execute on function public.create_organization(text,text) to authenticated;
drop policy organizations_insert_authenticated on public.organizations;
