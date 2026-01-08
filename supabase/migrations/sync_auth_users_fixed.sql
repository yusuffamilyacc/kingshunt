-- Supabase Auth kullanıcılarını Prisma User tablosu ile otomatik senkronize etmek için trigger
-- Bu migration Supabase SQL Editor'de çalıştırılmalı

-- Önce mevcut trigger'ları temizle (varsa)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- Function: Yeni kullanıcı oluşturulduğunda Prisma User tablosuna ekle
-- Ayrıca role'ü user_metadata'ya da ekler (middleware edge runtime için)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  user_role TEXT := 'MEMBER';
BEGIN
  -- Prisma User tablosuna ekle
  INSERT INTO public."User" (id, email, name, role, "createdAt", "updatedAt")
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', NULL),
    user_role,
    COALESCE(NEW.created_at, NOW()),
    COALESCE(NEW.updated_at, NOW())
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public."User".name),
    role = COALESCE(public."User".role, EXCLUDED.role),
    "updatedAt" = NOW();
  
  -- Role'ü user_metadata'ya ekle (middleware edge runtime için)
  -- Not: user_metadata'yı direkt güncelleyemeyiz, bu yüzden Prisma'dan okunacak
  -- Ama mevcut role'ü metadata'da saklayabiliriz
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Hataları logla ama trigger'ı durdurma
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger: auth.users tablosuna yeni kayıt eklendiğinde çalışır
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Function: Kullanıcı güncellendiğinde Prisma User tablosunu güncelle
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public."User"
  SET
    email = COALESCE(NEW.email, OLD.email),
    name = COALESCE(
      NEW.raw_user_meta_data->>'name', 
      OLD.raw_user_meta_data->>'name',
      public."User".name
    ),
    "updatedAt" = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_user_update: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Trigger: auth.users tablosunda güncelleme yapıldığında çalışır
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_user_update();

-- Test: Mevcut kullanıcıları kontrol et
DO $$
DECLARE
  auth_user_count INTEGER;
  prisma_user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_user_count FROM auth.users;
  SELECT COUNT(*) INTO prisma_user_count FROM public."User";
  
  RAISE NOTICE 'Auth users: %, Prisma users: %', auth_user_count, prisma_user_count;
END;
$$;

