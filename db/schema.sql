-- RouteFit AI / Ironfit MVP schema

create extension if not exists postgis;

create table if not exists users (
  id uuid primary key,
  email text unique not null,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists user_preferences (
  user_id uuid primary key references users(id) on delete cascade,
  level text,
  preferred_modality text,
  safety_priority int default 5,
  traffic_avoidance int default 5,
  climb_preference int default 5,
  park_preference int default 5,
  circular_preference int default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists route_requests (
  id uuid primary key,
  user_id uuid references users(id) on delete set null,
  location_label text not null,
  scheduled_date date not null,
  scheduled_time time not null,
  modality text not null,
  distance_km numeric(6,2) not null,
  training_type text not null,
  preferences_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists saved_routes (
  id uuid primary key,
  request_id uuid not null references route_requests(id) on delete cascade,
  route_kind text not null,
  title text not null,
  distance_km numeric(6,2) not null,
  estimated_minutes int not null,
  elevation_gain int not null,
  overall_score int not null,
  safety_score int not null,
  training_fit_score int not null,
  traffic_score int not null,
  elevation_score int not null,
  flow_score int not null,
  popularity_score int not null,
  recommendation_reason text not null,
  attention_points_json jsonb not null default '[]'::jsonb,
  polyline text,
  route_geometry geometry(LineString, 4326),
  provider text default 'google_maps',
  created_at timestamptz not null default now()
);
