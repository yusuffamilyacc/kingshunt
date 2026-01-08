-- Supabase Auth kullanıcılarını Prisma User tablosu ile otomatik senkronize etmek için trigger
-- Bu migration Supabase SQL Editor'de çalıştırılmalı

-- Function: Yeni kullanıcı oluşturulduğunda Prisma User tablosuna ekle
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."User" (id, email, name, role, "createdAt", "updatedAt")
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL),
    'MEMBER',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auth.users tablosuna yeni kayıt eklendiğinde çalışır
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Kullanıcı güncellendiğinde Prisma User tablosunu güncelle
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public."User"
  SET
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'name', OLD.raw_user_meta_data->>'name'),
    "updatedAt" = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auth.users tablosunda güncelleme yapıldığında çalışır
CREATE OR REPLACE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

