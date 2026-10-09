-- 0003 — димензии на фотографиите
--
-- Секоја фотографија ја памети својата ширина и висина, за да знаеме дали е
-- вертикална. Вертикалните се прикажуваат во целост (ништо не се сече),
-- хоризонталните го исполнуваат кадарот.
--
-- Безбедна за постоечки податоци — само додава две колони.

alter table public.vehicle_images add column if not exists width integer;
alter table public.vehicle_images add column if not exists height integer;

comment on column public.vehicle_images.width is 'Ширина на оригиналната фотографија во пиксели.';
comment on column public.vehicle_images.height is 'Висина на оригиналната фотографија во пиксели.';

notify pgrst, 'reload schema';

