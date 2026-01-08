-- Mevcut kullanıcıların role'lerini user_metadata'ya eklemek için
-- NOT: Bu SQL direkt user_metadata'yı güncelleyemez (Supabase Auth yönetiyor)
-- Bu yüzden Supabase Admin API kullanmanız gerekiyor

-- Alternatif çözüm: 
-- 1. Supabase Dashboard > Authentication > Users > [User] > Edit
-- 2. User Metadata'ya manuel olarak role ekleyin: {"role": "ADMIN"}
-- 3. Veya scripts/sync-role-to-metadata.js script'ini çalıştırın

-- Mevcut durumu kontrol et
SELECT 
  u.id,
  u.email,
  u.role as prisma_role,
  au.raw_user_meta_data->>'role' as metadata_role,
  au.raw_user_meta_data as full_metadata
FROM public."User" u
LEFT JOIN auth.users au ON u.id = au.id
WHERE au.raw_user_meta_data->>'role' IS NULL OR au.raw_user_meta_data->>'role' != u.role::text;

