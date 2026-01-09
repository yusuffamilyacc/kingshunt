# Prisma Connection Pooler "Prepared Statement Already Exists" Hatası Çözümü

## 🔴 Sorun

Connection pooler kullanırken şu hatayı alıyorsunuz:
```
Error: prepared statement "s0" already exists
```

**Neden?**
- Supabase connection pooler (pgbouncer) prepared statement'ları desteklemiyor
- Prisma Client prepared statement cache'i kullanıyor
- Connection pooler'da prepared statement'lar cache'lenemiyor ve çakışma oluşuyor

## ✅ Çözüm

### 1. Connection String'e `?pgbouncer=true` Ekleyin

Connection string'inizde **mutlaka** `?pgbouncer=true` parametresi olmalı:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**⚠️ ÖNEMLİ:** `?pgbouncer=true` parametresi **olmadan** bu hata devam eder!

### 2. Connection String Formatını Kontrol Edin

Connection string'iniz şu formatta olmalı:
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Doğru format:**
- ✅ `postgres.[PROJECT-REF]` (nokta ile)
- ✅ Port: `6543` (pooler portu)
- ✅ Host: `aws-0-[REGION].pooler.supabase.com`
- ✅ `?pgbouncer=true` parametresi

**Yanlış format:**
- ❌ `postgres:[PASSWORD]@db.[PROJECT-REF]` (direct connection)
- ❌ Port: `5432` (direct connection portu)
- ❌ `?pgbouncer=true` parametresi yok

### 3. Supabase Dashboard'dan Doğru URL'i Alın

1. Supabase Dashboard → Projeniz → **Settings** → **Database**
2. **Connection Pooling** sekmesine gidin
3. **Connection String** bölümünden **URI** formatını seçin
4. Connection string'i kopyalayın (otomatik olarak `?pgbouncer=true` içerecek)

### 4. Vercel'de Environment Variable'ı Güncelleyin

1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. `DATABASE_URL` değişkenini bulun
3. Değeri connection pooler URL'i ile güncelleyin (`?pgbouncer=true` dahil)
4. **Save** butonuna tıklayın
5. **Redeploy** yapın

### 5. Local .env Dosyasını Güncelleyin

`.env` dosyanızda connection string'in `?pgbouncer=true` içerdiğinden emin olun:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### 6. Development Server'ı Yeniden Başlatın

Değişikliklerin etkili olması için:

```bash
# Development server'ı durdurun (Ctrl+C)
# Sonra tekrar başlatın
npm run dev
```

## 🔍 Sorun Giderme

### Hata Hala Devam Ediyorsa

1. **Connection string'i kontrol edin:**
   ```bash
   # .env dosyasında DATABASE_URL'i kontrol edin
   echo $DATABASE_URL
   ```

2. **`?pgbouncer=true` parametresinin olduğundan emin olun:**
   - Connection string'in sonunda `?pgbouncer=true` olmalı
   - Eğer başka parametreler varsa: `?pgbouncer=true&other=param`

3. **Prisma Client'ı yeniden oluşturun:**
   ```bash
   npx prisma generate
   ```

4. **Development server'ı tamamen yeniden başlatın:**
   ```bash
   # Tüm process'leri durdurun
   # Sonra tekrar başlatın
   npm run dev
   ```

### Direct Connection Kullanmak (Geçici Çözüm)

Eğer sorun devam ederse, geçici olarak direct connection kullanabilirsiniz:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**⚠️ UYARI:** Direct connection connection limit sorunlarına yol açabilir. Sadece geçici çözüm olarak kullanın.

## 📚 Daha Fazla Bilgi

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [PgBouncer Prepared Statements](https://www.pgbouncer.org/features.html#prepared-statements)
