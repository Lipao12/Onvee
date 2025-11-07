create table barbershops (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  phone text,
  description text,
  image_url text,
  access_code text unique not null,
  admin_id uuid references auth.users(id) on delete set null,
  created_at timestamp default now()
);

create table services (
  id uuid primary key default uuid_generate_v4(),
  barbershop_id uuid references barbershops(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null,
  duration_minutes integer not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

CREATE TABLE barbers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  barbershop_id uuid REFERENCES barbershops(id) ON DELETE CASCADE,  -- vínculo com a barbearia
  full_name text NOT NULL,           -- nome completo do barbeiro
  bio text,                          -- breve descrição (ex: "Especialista em cortes modernos")
  phone text,                        -- telefone (opcional)
  image_url text,                    -- foto do barbeiro (armazenada no Supabase Storage)
  rating numeric(2,1) DEFAULT 0.0,   -- média de avaliações (0–5)
  is_active boolean DEFAULT true,    -- barbeiro ativo ou não
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

create table public.working_hours (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid references barbers(id) on delete cascade,
  day_of_week smallint not null, -- 0=Sunday, 6=Saturday
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.breaks (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid references barbers(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz not null,
  reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);



-- Trigger para atualizar automaticamente o campo updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_services_updated_at
before update on services
for each row
execute procedure update_updated_at_column();
