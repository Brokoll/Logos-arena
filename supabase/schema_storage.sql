-- 1. Create Storage Bucket (if not exists)
insert into storage.buckets (id, name, public)
values ('debate-images', 'debate-images', true)
on conflict (id) do nothing;

-- 2. Storage Policies
-- Allow public read access
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'debate-images' );

-- Allow authenticated uploads
drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'debate-images' and auth.role() = 'authenticated' );

-- 3. Add Columns to Tables
alter table public.arguments 
add column if not exists image_url text;

alter table public.comments 
add column if not exists image_url text;
