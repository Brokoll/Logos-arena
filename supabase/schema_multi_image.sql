-- Migrate to multiple images
alter table public.arguments 
drop column if exists image_url,
add column if not exists image_urls text[] default '{}';

alter table public.comments
drop column if exists image_url,
add column if not exists image_urls text[] default '{}';
