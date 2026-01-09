-- Trigger'ın çalışıp çalışmadığını test etmek için
-- Supabase SQL Editor'de çalıştırın

-- 1. Trigger'ların var olup olmadığını kontrol et
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated');

-- 2. Function'ların var olup olmadığını kontrol et
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'handle_user_update');

-- 3. Auth users vs Prisma users karşılaştırması
SELECT 
  'Auth Users' as source,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Prisma Users' as source,
  COUNT(*) as count
FROM public."User";

-- 4. Senkronize olmayan kullanıcıları bul
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created,
  pu.id as prisma_id,
  pu."createdAt" as prisma_created
FROM auth.users au
LEFT JOIN public."User" pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- 5. Manuel olarak bir kullanıcıyı test et (dikkatli kullanın!)
-- Bu sadece test için, gerçek kullanıcı oluşturmayın
/*
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES (
  gen_random_uuid(),
  'test@example.com',
  crypt('test123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "Test User"}'::jsonb
);
*/



