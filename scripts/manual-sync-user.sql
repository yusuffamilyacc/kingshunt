-- Manuel olarak bir kullanıcıyı Prisma User tablosuna eklemek için
-- Supabase SQL Editor'de çalıştırın
-- Kullanıcı ID'sini değiştirin

-- Örnek: Belirli bir kullanıcıyı ekle
INSERT INTO public."User" (id, email, name, role, "createdAt", "updatedAt")
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', NULL) as name,
  'MEMBER' as role,
  created_at as "createdAt",
  updated_at as "updatedAt"
FROM auth.users
WHERE id = 'KULLANICI-ID-BURAYA' -- Buraya Supabase Auth user ID'sini yazın
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, public."User".name),
  "updatedAt" = NOW();

-- Veya tüm eksik kullanıcıları toplu ekle
INSERT INTO public."User" (id, email, name, role, "createdAt", "updatedAt")
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', NULL) as name,
  'MEMBER' as role,
  created_at as "createdAt",
  updated_at as "updatedAt"
FROM auth.users
WHERE id NOT IN (SELECT id FROM public."User")
ON CONFLICT (id) DO UPDATE
SET
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, public."User".name),
  "updatedAt" = NOW();

-- Sonuçları kontrol et
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  'Synced' as status
FROM public."User" u
ORDER BY u."createdAt" DESC;

