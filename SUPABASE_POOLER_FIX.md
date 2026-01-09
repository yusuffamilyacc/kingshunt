# Supabase Connection Pooler - MaxClients Hatası Çözümü

## 🔴 Sorun

Supabase Free tier'da **"MaxClientsInSessionMode: max clients reached"** hatası alıyorsunuz.

**Neden?**
- Supabase Free tier'da direct connection (port 5432) çok sınırlıdır (1-2 connection)
- Her request'te yeni connection açılırsa pool hızla tükenir

## ✅ Çözüm: Connection Pooler Kullanın

Supabase'in **Connection Pooler** özelliğini kullanmalısınız. Bu, daha fazla eşzamanlı connection'a izin verir.

### 1. Supabase Dashboard'dan Connection Pooler URL'i Alın

1. [Supabase Dashboard](https://supabase.com) → Projenizi seçin
2. **Settings** → **Database** → **Connection Pooling** sekmesine gidin
3. **Connection String** bölümünden **URI** formatını seçin
4. Connection string'i kopyalayın

**Örnek format:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

### 2. .env Dosyasını Güncelleyin

**ÖNCEKİ (Direct Connection - Sınırlı):**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**YENİ (Connection Pooler - Önerilen):**
```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**⚠️ ÖNEMLİ:** Connection string'de `?pgbouncer=true` parametresi **mutlaka** olmalı! Bu parametre olmadan "prepared statement already exists" hatası alırsınız.

### 3. Vercel'de Environment Variable'ı Güncelleyin

1. Vercel Dashboard → Projeniz → **Settings** → **Environment Variables**
2. `DATABASE_URL` değişkenini bulun
3. Değeri connection pooler URL'i ile güncelleyin
4. **Save** butonuna tıklayın
5. **Redeploy** yapın (değişikliklerin etkili olması için)

### 4. Migration'lar İçin Not

**ÖNEMLİ:** Migration çalıştırırken direct connection kullanmanız gerekebilir:

```bash
# Migration için geçici olarak direct connection kullanın
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" npx prisma migrate deploy
```

Veya migration'ları local'de çalıştırıp production'a deploy edin:
```bash
npx prisma migrate deploy
```

## 🔍 Connection Pooler vs Direct Connection

| Özellik | Direct (5432) | Pooler (6543) |
|---------|---------------|---------------|
| **Port** | 5432 | 6543 |
| **Connection Limit** | Çok düşük (1-2) | Daha yüksek |
| **Kullanım** | Migration'lar için | Uygulama için |
| **URL Format** | `db.[PROJECT-REF].supabase.co` | `aws-0-[REGION].pooler.supabase.com` |

## ✅ Kontrol Listesi

- [ ] Supabase Dashboard'dan Connection Pooler URL'i aldım
- [ ] `.env` dosyasındaki `DATABASE_URL` güncellendi
- [ ] Vercel'de `DATABASE_URL` environment variable güncellendi
- [ ] Vercel'de redeploy yapıldı
- [ ] Uygulama test edildi (hata düzeldi mi?)

## 🚨 Hala Hata Alıyorsanız

1. **Prisma Client Singleton:** `lib/prisma.ts` dosyasında singleton pattern kullanıldığından emin olun ✅ (Zaten yapıldı)
2. **Connection Limit:** Supabase Pro tier'a geçmeyi düşünün (daha yüksek limit)
3. **Connection Leaks:** Tüm Prisma query'lerinin düzgün kapatıldığından emin olun

## 📚 Daha Fazla Bilgi

- [Supabase Connection Pooling Docs](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Prisma Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
