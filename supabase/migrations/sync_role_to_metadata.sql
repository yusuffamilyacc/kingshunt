-- Role'ü Prisma User tablosundan Supabase user_metadata'ya senkronize eden trigger
-- Bu, middleware edge runtime'da role'ü okumak için gerekli
-- Supabase SQL Editor'de çalıştırın

-- Function: Prisma User tablosundaki role değiştiğinde user_metadata'yı güncelle
CREATE OR REPLACE FUNCTION public.sync_role_to_metadata()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- user_metadata'yı direkt güncelleyemeyiz (Supabase Auth yönetiyor)
  -- Bu yüzden role kontrolü için Prisma User tablosunu kullanacağız
  -- Middleware'de API route üzerinden role kontrolü yapılacak
  
  RETURN NEW;
END;
$$;

-- Alternatif: Role'ü user_metadata'da saklamak için
-- Register sırasında role'ü metadata'ya ekleyin (app/auth/register/page.tsx'de zaten var)
-- Veya bu trigger'ı kullanarak Prisma'dan metadata'ya senkronize edin

-- Mevcut kullanıcıların role'lerini metadata'ya eklemek için
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', (
    SELECT role::text 
    FROM public."User" 
    WHERE id = auth.users.id
  ))
WHERE id IN (SELECT id FROM public."User");



