-- AJUNILO BUSINESS+ — schéma Supabase. À exécuter une fois dans SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security; -- aucune policy : lisible seulement via is_admin()

create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()) $$;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique check (reference ~ '^[A-Za-z0-9_-]+$'),
  brand text not null, model text not null, name text not null,
  description text, processor text, cpu_generation text,
  ram_gb int check (ram_gb > 0), storage_type text, storage_gb int check (storage_gb > 0),
  screen_size text, resolution text, gpu text, os text,
  condition text not null default 'occasion' check (condition in ('neuf','occasion')),
  battery text, warranty text,
  price numeric not null check (price >= 0), old_price numeric check (old_price >= 0),
  status text not null default 'disponible' check (status in ('disponible','vendu','rupture')),
  is_published boolean not null default true, is_promo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null, path text not null, position int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_images_product_idx on public.product_images(product_id);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 120),
  phone text check (length(phone) <= 40), email text check (length(email) <= 160),
  message text not null check (length(message) between 1 and 2000),
  product_ref text,
  status text not null default 'nouvelle' check (status in ('nouvelle','en_cours','traitee')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  business_name text not null default 'AJUNILO BUSINESS+',
  whatsapp_number text not null default '',
  logo_url text, phone text, email text, address text,
  about_text text, hero_title text, hero_subtitle text
);
insert into public.site_settings (id) values (1) on conflict do nothing;

create table if not exists public.product_views (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  viewed_at timestamptz not null default now()
);
create index if not exists product_views_product_idx on public.product_views(product_id);

create or replace view public.product_view_counts with (security_invoker = true) as
  select product_id, count(*)::int as views from public.product_views group by product_id;
grant select on public.product_view_counts to authenticated;

-- RLS
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_settings enable row level security;
alter table public.product_views enable row level security;

create policy "public lit les produits publiés" on public.products for select using (is_published);
create policy "admin gère les produits" on public.products for all using (public.is_admin()) with check (public.is_admin());

create policy "public lit les images des produits publiés" on public.product_images for select
  using (exists (select 1 from public.products p where p.id = product_id and p.is_published));
create policy "admin gère les images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());

create policy "public lit les paramètres" on public.site_settings for select using (true);
create policy "admin modifie les paramètres" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

create policy "public envoie une demande" on public.inquiries for insert to anon, authenticated with check (status = 'nouvelle');
create policy "admin gère les demandes" on public.inquiries for all using (public.is_admin()) with check (public.is_admin());

create policy "public enregistre une vue" on public.product_views for insert to anon, authenticated
  with check (exists (select 1 from public.products p where p.id = product_id and p.is_published));
create policy "admin lit les vues" on public.product_views for select using (public.is_admin());

-- Stockage des images
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict (id) do nothing;
create policy "images publiques en lecture" on storage.objects for select using (bucket_id = 'products');
create policy "admin envoie des images" on storage.objects for insert to authenticated with check (bucket_id = 'products' and public.is_admin());
create policy "admin modifie des images" on storage.objects for update to authenticated using (bucket_id = 'products' and public.is_admin());
create policy "admin supprime des images" on storage.objects for delete to authenticated using (bucket_id = 'products' and public.is_admin());

-- Après avoir créé votre utilisateur dans Authentication > Users, exécutez (avec VOTRE email) :
-- insert into public.admin_users (user_id) select id from auth.users where email = 'vous@exemple.com';
