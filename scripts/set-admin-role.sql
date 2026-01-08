-- Kullanıcının role'ünü ADMIN yapmak için
-- Supabase SQL Editor'de çalıştırın

-- Yöntem 1: Email ile (Önerilen)
UPDATE public."User" 
SET role = 'ADMIN'
WHERE email = 'YOUR-EMAIL@example.com'; -- Buraya email'inizi yazın

-- Yöntem 2: User ID ile
-- UPDATE public."User" 
-- SET role = 'ADMIN'
-- WHERE id = 'USER-ID-HERE'; -- Buraya Supabase Auth user ID'sini yazın

-- Sonucu kontrol et
SELECT 
  id,
  email,
  name,
  role,
  "updatedAt"
FROM public."User"
WHERE role = 'ADMIN';


