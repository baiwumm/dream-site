create table public.ds_categorys (
  id uuid not null default gen_random_uuid (),
  name text not null,
  "desc" text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  user_id uuid null default auth.uid (),
  email text null,
  sort smallint null,
  icon text null default ''::text,
  constraint site_category_pkey primary key (id),
  constraint site_category_name_key unique (name)
) TABLESPACE pg_default;

create table public.ds_websites (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_id uuid null default auth.uid (),
  email text null,
  name text null,
  "desc" text null,
  logo text null,
  tags text[] null,
  sort smallint null,
  updated_at timestamp with time zone null default now(),
  url text null,
  pinned boolean null default false,
  vpn boolean null default false,
  category_id uuid null default gen_random_uuid (),
  recommend boolean null default false,
  color text null default ''::text,
  "visitCount" integer null default 0,
  "commonlyUsed" boolean null default false,
  constraint websites_pkey primary key (id),
  constraint ds_websites_category_id_fkey foreign KEY (category_id) references ds_categorys (id)
) TABLESPACE pg_default;

create index IF not exists idx_ds_websites_id on public.ds_websites using btree (id) TABLESPACE pg_default;