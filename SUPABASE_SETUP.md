# Supabase Auth Kurulum Rehberi

## 1. Supabase Project URL ve Key'leri Alma

### Adımlar:

1. **Supabase Dashboard'a giriş yapın**
   - https://supabase.com/dashboard adresine gidin
   - Hesabınıza giriş yapın

2. **Projenizi seçin**
   - Mevcut projenizi seçin veya yeni bir proje oluşturun

3. **API Settings'e gidin**
   - Sol menüden **Settings** (⚙️) ikonuna tıklayın
   - **API** sekmesine tıklayın

4. **Project URL'i kopyalayın**
   - **Project URL** bölümünde URL'i bulun
   - Örnek format: `https://xxxxx.supabase.co`
   - Bu URL'i kopyalayın

5. **Anon Key'i kopyalayın**
   - **Project API keys** bölümünde **anon** veya **public** key'i bulun
   - Bu key'i kopyalayın (uzun bir JWT token gibi görünür)
   - ⚠️ **service_role** key'ini kullanmayın! (Bu sadece server-side için)

## 2. Supabase Authentication Ayarları

### Email/Password Provider'ı Aktifleştirin:

1. Sol menüden **Authentication** sekmesine gidin
2. **Providers** sekmesine tıklayın
3. **Email** provider'ını bulun ve **Enable** yapın
4. İsteğe bağlı olarak:
   - **Confirm email** seçeneğini açabilirsiniz (production için önerilir)
   - **Secure email change** seçeneğini açabilirsiniz

## 3. Vercel Environment Variables

Vercel Dashboard'da environment variables ekleyin:

1. **Vercel Dashboard** > **Project Settings** > **Environment Variables**

2. Şu değişkenleri ekleyin:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

3. **Environment** seçeneklerini işaretleyin:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. **Save** butonuna tıklayın

## 4. Local Development (.env.local)

Projenizin root dizininde `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

⚠️ **Önemli:** `.env.local` dosyasını `.gitignore`'a eklediğinizden emin olun!

## 5. Database Schema

Supabase Auth kullanıcıları otomatik olarak `auth.users` tablosunda saklanır. 
Prisma schema'nızda `User` modeli Supabase Auth user ID'sini kullanmalı:

```prisma
model User {
  id        String   @id // Supabase Auth user ID
  email     String   @unique
  name      String?
  role      Role     @default(MEMBER)
  // password field artık gerekli değil (Supabase Auth yönetiyor)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  enrollments Enrollment[]
}
```

## 6. İlk Admin Kullanıcı Oluşturma

Mevcut `create-admin.js` script'i Supabase Auth ile çalışmıyor. 
Yeni bir script oluşturmanız gerekecek veya Supabase Dashboard'dan manuel olarak kullanıcı oluşturup Prisma'da role'ü güncelleyin.

## 7. Test Etme

1. Development server'ı başlatın: `npm run dev`
2. `/auth/register` sayfasına gidin
3. Yeni bir kullanıcı oluşturun
4. `/auth/login` sayfasından giriş yapın
5. Session'ın doğru çalıştığını kontrol edin

## Sorun Giderme

### "Invalid API key" hatası
- Anon key'in doğru kopyalandığından emin olun
- `NEXT_PUBLIC_` prefix'inin olduğundan emin olun

### "User not found" hatası
- Kullanıcı Supabase Auth'da oluşturuldu mu kontrol edin
- Prisma'da user kaydının oluşturulduğunu kontrol edin

### Session cookie sorunları
- Supabase project URL'inin doğru olduğundan emin olun
- Vercel'de environment variables'ın doğru ayarlandığından emin olun

