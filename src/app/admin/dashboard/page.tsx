
create table public.product_durations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null
    references public.products(id) on delete cascade,
  label text not null,
  price numeric not null check (price >= 0),
  created_at timestamptz not null default now()
);

alter table public.product_durations
  enable row level security;

grant select on public.product_durations to anon;
grant select, insert, update, delete
  on public.product_durations to authenticated;

create policy "Public can read durations"
on public.product_durations
for select to anon, authenticated
using (true);

create policy "Admins can add durations"
on public.product_durations
for insert to authenticated
with check (
  exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  )
);

create policy "Admins can edit durations"
on public.product_durations
for update to authenticated
using (
  exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  )
);

create policy "Admins can delete durations"
on public.product_durations
for delete to authenticated
using (
  exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid())
  )
);
