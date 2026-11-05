create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

create function private.trim_text(p_value text)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select btrim(
    p_value,
    U&'\0009\000A\000B\000C\000D\0020\00A0\1680' ||
    U&'\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A' ||
    U&'\2028\2029\202F\205F\3000\FEFF'
  );
$$;

create type public.user_role as enum ('manager', 'executor');
create type public.task_status as enum ('new', 'in_progress', 'in_review', 'accepted', 'revision');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete restrict,
  full_name text not null check (char_length(private.trim_text(full_name)) between 1 and 100),
  role public.user_role not null default 'executor',
  created_at timestamptz not null default now()
);

create table public.construction_objects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(private.trim_text(name)) between 1 and 150),
  address text not null check (char_length(private.trim_text(address)) between 1 and 300),
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  revision integer not null default 1
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(private.trim_text(title)) between 1 and 200),
  description text not null default '' check (char_length(description) <= 5000),
  object_id uuid not null references public.construction_objects (id),
  assignee_id uuid not null references public.profiles (id),
  status public.task_status not null default 'new',
  author_id uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  revision integer not null default 1
);

create table public.task_history (
  id bigint generated always as identity primary key,
  task_id uuid not null references public.tasks (id) on delete restrict,
  actor_id uuid not null references public.profiles (id),
  actor_name text not null,
  from_status public.task_status,
  to_status public.task_status not null,
  comment text check (char_length(comment) <= 2000),
  created_at timestamptz not null default now()
);

create index tasks_assignee_active_idx on public.tasks (assignee_id, object_id) where deleted_at is null;
create index tasks_object_active_idx on public.tasks (object_id, created_at desc) where deleted_at is null;
create index task_history_task_idx on public.task_history (task_id, id);

create function private.is_manager()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'manager'
  );
$$;

create function private.require_manager()
returns uuid
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_manager() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  return auth.uid();
end;
$$;

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    left(
      coalesce(
        nullif(private.trim_text(new.raw_user_meta_data ->> 'full_name'), ''),
        split_part(new.email, '@', 1),
        'Пользователь'
      ),
      100
    ),
    case when new.raw_app_meta_data ->> 'crm_role' = 'manager'
      then 'manager'::public.user_role
      else 'executor'::public.user_role
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create function private.record_task_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous_status public.task_status;
  transition_comment text;
begin
  if tg_op = 'UPDATE' then
    if new.status = old.status then
      return new;
    end if;
    previous_status := old.status;
    transition_comment := nullif(private.trim_text(current_setting('crm.transition_comment', true)), '');
  end if;

  insert into public.task_history (task_id, actor_id, actor_name, from_status, to_status, comment)
  select new.id, auth.uid(), p.full_name, previous_status, new.status, transition_comment
  from public.profiles p where p.id = auth.uid();

  if not found then
    raise exception 'UNAUTHENTICATED' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger record_task_status
after insert or update of status on public.tasks
for each row execute function private.record_task_status();

create function private.reject_history_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'HISTORY_IMMUTABLE' using errcode = '42501';
end;
$$;

create trigger task_history_immutable
before update or delete on public.task_history
for each row execute function private.reject_history_change();

alter table public.profiles enable row level security;
alter table public.construction_objects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_history enable row level security;

create policy tasks_read on public.tasks for select to authenticated
using (deleted_at is null and (private.is_manager() or assignee_id = (select auth.uid())));

create policy objects_read on public.construction_objects for select to authenticated
using (
  deleted_at is null and (
    private.is_manager() or exists (
      select 1 from public.tasks t
      where t.object_id = construction_objects.id and t.assignee_id = (select auth.uid()) and t.deleted_at is null
    )
  )
);

create policy profiles_read on public.profiles for select to authenticated
using (
  private.is_manager() or id = (select auth.uid()) or exists (
    select 1 from public.tasks t
    where t.author_id = profiles.id and t.assignee_id = (select auth.uid()) and t.deleted_at is null
  )
);

create policy history_read on public.task_history for select to authenticated
using (
  private.is_manager() or exists (
    select 1 from public.tasks t
    where t.id = task_history.task_id and t.assignee_id = (select auth.uid()) and t.deleted_at is null
  )
);

revoke all on
  public.profiles,
  public.construction_objects,
  public.tasks,
  public.task_history
from public, anon, authenticated;
revoke all on sequence public.task_history_id_seq from public, anon, authenticated;
grant select on public.profiles, public.construction_objects, public.tasks, public.task_history to authenticated;
revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_manager() to authenticated;
grant execute on function private.trim_text(text) to authenticated, service_role;

create function public.create_object(p_name text, p_address text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := private.require_manager();
  object_id uuid;
begin
  insert into public.construction_objects (name, address, created_by)
  values (private.trim_text(p_name), private.trim_text(p_address), actor)
  returning id into object_id;
  return object_id;
end;
$$;

create function public.update_object(p_id uuid, p_name text, p_address text, p_revision integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_manager();
  update public.construction_objects
  set name = private.trim_text(p_name), address = private.trim_text(p_address), revision = revision + 1, updated_at = now()
  where id = p_id and deleted_at is null and revision = p_revision;
  if not found then
    raise exception 'STALE_RECORD' using errcode = 'PT409';
  end if;
end;
$$;

create function public.delete_object(p_id uuid, p_revision integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_object public.construction_objects;
begin
  perform private.require_manager();
  select * into current_object from public.construction_objects where id = p_id and deleted_at is null for update;
  if not found or current_object.revision is distinct from p_revision then
    raise exception 'STALE_RECORD' using errcode = 'PT409';
  end if;
  if exists (select 1 from public.tasks where object_id = p_id and deleted_at is null) then
    raise exception 'OBJECT_NOT_EMPTY' using errcode = '23503';
  end if;
  update public.construction_objects
  set deleted_at = now(), updated_at = now(), revision = revision + 1
  where id = p_id;
end;
$$;

create function public.create_task(p_title text, p_description text, p_object_id uuid, p_assignee_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := private.require_manager();
  task_id uuid;
begin
  perform 1 from public.construction_objects where id = p_object_id and deleted_at is null for update;
  if not found then
    raise exception 'OBJECT_NOT_FOUND' using errcode = '23503';
  end if;
  if not exists (select 1 from public.profiles where id = p_assignee_id and role = 'executor') then
    raise exception 'INVALID_ASSIGNEE' using errcode = '23514';
  end if;
  insert into public.tasks (title, description, object_id, assignee_id, author_id)
  values (private.trim_text(p_title), private.trim_text(p_description), p_object_id, p_assignee_id, actor)
  returning id into task_id;
  return task_id;
end;
$$;

create function public.update_task(
  p_id uuid,
  p_title text,
  p_description text,
  p_object_id uuid,
  p_assignee_id uuid,
  p_revision integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_manager();
  perform 1 from public.construction_objects where id = p_object_id and deleted_at is null for update;
  if not found then
    raise exception 'OBJECT_NOT_FOUND' using errcode = '23503';
  end if;
  if not exists (select 1 from public.profiles where id = p_assignee_id and role = 'executor') then
    raise exception 'INVALID_ASSIGNEE' using errcode = '23514';
  end if;
  update public.tasks
  set title = private.trim_text(p_title), description = private.trim_text(p_description), object_id = p_object_id,
      assignee_id = p_assignee_id, revision = revision + 1, updated_at = now()
  where id = p_id and deleted_at is null and revision = p_revision;
  if not found then
    raise exception 'STALE_RECORD' using errcode = 'PT409';
  end if;
end;
$$;

create function public.delete_task(p_id uuid, p_revision integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_manager();
  update public.tasks
  set deleted_at = now(), updated_at = now(), revision = revision + 1
  where id = p_id and deleted_at is null and revision = p_revision;
  if not found then
    raise exception 'STALE_RECORD' using errcode = 'PT409';
  end if;
end;
$$;

create function public.transition_task(
  p_id uuid,
  p_status public.task_status,
  p_revision integer,
  p_comment text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_task public.tasks;
  actor uuid := auth.uid();
  actor_role public.user_role;
  allowed boolean := false;
  normalized_comment text := nullif(private.trim_text(p_comment), '');
begin
  select role into actor_role from public.profiles where id = actor;
  if actor_role is null then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  select * into current_task from public.tasks
  where id = p_id and deleted_at is null and (actor_role = 'manager' or assignee_id = actor)
  for update;

  if not found then
    raise exception 'TASK_NOT_FOUND' using errcode = '42501';
  end if;
  if current_task.revision is distinct from p_revision then
    raise exception 'STALE_RECORD' using errcode = 'PT409';
  end if;

  if actor_role = 'executor' and current_task.assignee_id = actor then
    allowed := (current_task.status in ('new', 'revision') and p_status = 'in_progress')
      or (current_task.status = 'in_progress' and p_status = 'in_review');
  elsif actor_role = 'manager' then
    allowed := current_task.status = 'in_review' and p_status in ('accepted', 'revision');
  end if;

  if allowed is not true then
    raise exception 'INVALID_TRANSITION' using errcode = '23514';
  end if;
  if p_status = 'revision' and normalized_comment is null then
    raise exception 'COMMENT_REQUIRED' using errcode = '23514';
  end if;
  if char_length(normalized_comment) > 2000 then
    raise exception 'COMMENT_TOO_LONG' using errcode = '23514';
  end if;

  perform set_config('crm.transition_comment', coalesce(normalized_comment, ''), true);
  update public.tasks set status = p_status, revision = revision + 1, updated_at = now() where id = p_id;
  perform set_config('crm.transition_comment', '', true);
end;
$$;

revoke all on function public.create_object(text, text) from public, anon, authenticated;
revoke all on function public.update_object(uuid, text, text, integer) from public, anon, authenticated;
revoke all on function public.delete_object(uuid, integer) from public, anon, authenticated;
revoke all on function public.create_task(text, text, uuid, uuid) from public, anon, authenticated;
revoke all on function public.update_task(uuid, text, text, uuid, uuid, integer) from public, anon, authenticated;
revoke all on function public.delete_task(uuid, integer) from public, anon, authenticated;
revoke all on function public.transition_task(uuid, public.task_status, integer, text) from public, anon, authenticated;

grant execute on function public.create_object(text, text) to authenticated;
grant execute on function public.update_object(uuid, text, text, integer) to authenticated;
grant execute on function public.delete_object(uuid, integer) to authenticated;
grant execute on function public.create_task(text, text, uuid, uuid) to authenticated;
grant execute on function public.update_task(uuid, text, text, uuid, uuid, integer) to authenticated;
grant execute on function public.delete_task(uuid, integer) to authenticated;
grant execute on function public.transition_task(uuid, public.task_status, integer, text) to authenticated;
