-- Mevcut Supabase Auth kullanıcılarını Prisma User tablosuna toplu ekleme
-- Supabase SQL Editor'de çalıştırın

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

-- Sonuçları kontrol edin
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  CASE 
    WHEN au.id IS NOT NULL THEN 'Synced'
    ELSE 'Not in Auth'
  END as status
FROM public."User" u
LEFT JOIN auth.users au ON u.id = au.id;

