-- Kullanıcının role'ünü kontrol etmek için
-- Supabase SQL Editor'de çalıştırın

-- 1. Tüm kullanıcıları ve role'lerini listele
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  au.email as auth_email,
  CASE 
    WHEN u.id IS NULL THEN 'Prisma User tablosunda yok'
    WHEN au.id IS NULL THEN 'Auth users tablosunda yok'
    ELSE 'Senkronize'
  END as status
FROM auth.users au
LEFT JOIN public."User" u ON au.id = u.id
ORDER BY au.created_at DESC;

-- 2. Belirli bir email için role kontrolü
-- Email'i değiştirin
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  'Current role' as info
FROM public."User" u
WHERE u.email = 'YOUR-EMAIL@example.com'; -- Buraya email'inizi yazın

