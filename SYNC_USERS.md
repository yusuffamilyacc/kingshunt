# Supabase Auth - Prisma User Senkronizasyon Rehberi

## Yöntem 1: Otomatik Senkronizasyon (Önerilen) - Database Trigger

Supabase Auth'da yeni kullanıcı oluşturulduğunda otomatik olarak Prisma User tablosuna eklenir.

### Kurulum Adımları:

1. **Supabase Dashboard'a gidin**
   - https://supabase.com/dashboard
   - Projenizi seçin

2. **SQL Editor'ü açın**
   - Sol menüden **SQL Editor** sekmesine tıklayın
   - **New query** butonuna tıklayın

3. **Migration SQL'ini çalıştırın**
   - `supabase/migrations/sync_auth_users.sql` dosyasındaki SQL'i kopyalayın
   - SQL Editor'e yapıştırın
   - **Run** butonuna tıklayın

4. **Test edin**
   - Yeni bir kullanıcı kaydedin (`/auth/register`)
   - Supabase Dashboard > **Table Editor** > **User** tablosuna bakın
   - Kullanıcının otomatik olarak eklendiğini görün

### Nasıl Çalışır?

- `handle_new_user()` fonksiyonu: Yeni kullanıcı oluşturulduğunda çalışır
- `on_auth_user_created` trigger: `auth.users` tablosuna INSERT yapıldığında tetiklenir
- Kullanıcı otomatik olarak Prisma `User` tablosuna eklenir

## Yöntem 2: Manuel Senkronizasyon - API Endpoint

Mevcut Supabase Auth kullanıcılarını manuel olarak senkronize etmek için:

### Kullanım:

1. **Kendi kullanıcınızı senkronize edin:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/sync-user \
     -H "Content-Type: application/json"
   ```

2. **Admin olarak başka bir kullanıcıyı senkronize edin:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/sync-user \
     -H "Content-Type: application/json" \
     -d '{"userId": "user-id-here"}'
   ```

3. **Tüm kullanıcıları listele (Admin only):**
   ```bash
   curl http://localhost:3000/api/auth/sync-user
   ```

## Yöntem 3: Mevcut Kullanıcıları Toplu Senkronize Etme

Supabase Dashboard'dan manuel oluşturduğunuz kullanıcıları senkronize etmek için:

### Adımlar:

1. **Supabase Dashboard > Authentication > Users**
   - Tüm kullanıcıları görüntüleyin
   - Her kullanıcının ID'sini kopyalayın

2. **Script oluşturun** (`scripts/sync-existing-users.js`):
   ```javascript
   // Bu script'i çalıştırmak için Supabase Admin API kullanmanız gerekir
   // Veya manuel olarak her kullanıcı için /api/auth/sync-user endpoint'ini çağırın
   ```

3. **Alternatif: SQL ile toplu ekleme**
   ```sql
   -- Supabase SQL Editor'de çalıştırın
   INSERT INTO public."User" (id, email, name, role, "createdAt", "updatedAt")
   SELECT 
     id,
     email,
     raw_user_meta_data->>'name' as name,
     'MEMBER' as role,
     created_at as "createdAt",
     updated_at as "updatedAt"
   FROM auth.users
   WHERE id NOT IN (SELECT id FROM public."User")
   ON CONFLICT (id) DO NOTHING;
   ```

## Sorun Giderme

### Trigger çalışmıyor
- Supabase SQL Editor'de trigger'ın oluşturulduğunu kontrol edin:
  ```sql
  SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
  ```

### Kullanıcı oluşturuldu ama Prisma'da yok
- Trigger'ın doğru çalıştığını kontrol edin
- Manuel olarak `/api/auth/sync-user` endpoint'ini çağırın
- Supabase Dashboard > Logs'da hata var mı kontrol edin

### Permission denied hatası
- Trigger fonksiyonunda `SECURITY DEFINER` kullanıldığından emin olun
- Supabase Dashboard > Database > Roles'da gerekli izinlerin olduğunu kontrol edin

## Önerilen Yaklaşım

1. **Yeni projeler için:** Yöntem 1 (Database Trigger) - Otomatik senkronizasyon
2. **Mevcut kullanıcılar için:** Yöntem 3 (SQL ile toplu ekleme)
3. **Manuel senkronizasyon için:** Yöntem 2 (API Endpoint)

## Notlar

- Trigger sadece **yeni** kullanıcılar için çalışır
- Mevcut kullanıcılar için manuel senkronizasyon gerekir
- Admin kullanıcı oluşturmak için Prisma'da role'ü `ADMIN` olarak güncelleyin:
  ```sql
  UPDATE public."User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
  ```



