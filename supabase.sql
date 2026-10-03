-- Ejecutar en Supabase > SQL Editor
create table public.contactos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  correo text not null,
  mensaje text not null,
  creado_en timestamptz default now()
);

alter table public.contactos enable row level security;

create policy "insertar_publico" on public.contactos
  for insert to anon with check (true);

create policy "leer_publico" on public.contactos
  for select to anon using (true);
