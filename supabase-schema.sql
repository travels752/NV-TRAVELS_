-- NV TRAVELSS DATABASE STRUCTURE
-- Run this SQL in your Supabase SQL Editor later.

create table if not exists public.profiles (
id uuid primary key references auth.users(id) on delete cascade,
full_name text,
phone text unique,
role text not null default 'customer'
check (role in ('customer', 'driver', 'hotel_owner', 'admin')),
created_at timestamptz not null default now()
);

create table if not exists public.rides (
id uuid primary key default gen_random_uuid(),
customer_id uuid references auth.users(id) on delete set null,
driver_id uuid references auth.users(id) on delete set null,
pickup text not null,
destination text not null,
vehicle text not null,
fare numeric(10,2) check (fare >= 0),
status text not null default 'searching'
check (status in (
'searching', 'accepted', 'driver_coming',
'started', 'completed', 'cancelled'
)),
ride_otp text,
otp_verified boolean not null default false,
pickup_lat double precision,
pickup_lng double precision,
destination_lat double precision,
destination_lng double precision,
driver_lat double precision,
driver_lng double precision,
created_at timestamptz not null default now()
);

create table if not exists public.hotels (
id uuid primary key default gen_random_uuid(),
owner_id uuid references auth.users(id) on delete set null,
name text not null,
city text not null,
address text,
description text,
price_per_night numeric(10,2) check (price_per_night >= 0),
image_url text,
is_active boolean not null default true,
created_at timestamptz not null default now()
);

create table if not exists public.hotel_bookings (
id uuid primary key default gen_random_uuid(),
hotel_id uuid references public.hotels(id) on delete set null,
customer_id uuid references auth.users(id) on delete set null,
check_in date not null,
check_out date not null,
guests integer not null default 1 check (guests > 0),
status text not null default 'pending'
check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
created_at timestamptz not null default now(),
check (check_out > check_in)
);

create table if not exists public.travel_packages (
id uuid primary key default gen_random_uuid(),
title text not null,
destination text not null,
days integer not null check (days > 0),
price numeric(10,2) check (price >= 0),
description text,
image_url text,
is_active boolean not null default true,
created_at timestamptz not null default now()
);

create table if not exists public.reels (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id) on delete set null,
caption text,
video_url text not null,
created_at timestamptz not null default now()
);

create table if not exists public.reel_likes (
reel_id uuid references public.reels(id) on delete cascade,
user_id uuid references auth.users(id) on delete cascade,
created_at timestamptz not null default now(),
primary key (reel_id, user_id)
);

create table if not exists public.reel_comments (
id uuid primary key default gen_random_uuid(),
reel_id uuid not null references public.reels(id) on delete cascade,
user_id uuid references auth.users(id) on delete set null,
comment text not null,
created_at timestamptz not null default now()
);

-- Enable row-level security on all app tables.
alter table public.profiles enable row level security;
alter table public.rides enable row level security;
alter table public.hotels enable row level security;
alter table public.hotel_bookings enable row level security;
alter table public.travel_packages enable row level security;
alter table public.reels enable row level security;
alter table public.reel_likes enable row level security;
alter table public.reel_comments enable row level security;
