-- Mevcut kullanıcıların role'lerini Supabase user_metadata'ya senkronize eder
-- Supabase SQL Editor'de çalıştırın
-- Not: Bu SQL direkt user_metadata'yı güncelleyemez (Supabase Auth yönetiyor)
-- Bu yüzden Supabase Admin API kullanmanız gerekiyor (scripts/sync-role-to-metadata.js)

-- Alternatif: Role kontrolü için Prisma User tablosunu kullanın
-- Middleware'de API route üzerinden role kontrolü yapılacak

-- Mevcut kullanıcıların role'lerini kontrol et
SELECT 
  u.id,
  u.email,
  u.role as prisma_role,
  au.raw_user_meta_data->>'role' as metadata_role,
  CASE 
    WHEN u.role::text = au.raw_user_meta_data->>'role' THEN '✅ Senkronize'
    ELSE '⚠️ Farklı'
  END as status
FROM public."User" u
LEFT JOIN auth.users au ON u.id = au.id
ORDER BY u."createdAt" DESC;



