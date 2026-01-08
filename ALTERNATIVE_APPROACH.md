# Alternatif Yaklaşım: Supabase Auth user_metadata ile Role Yönetimi

## Yaklaşım: user_metadata'da Role Saklama

Supabase Auth'un `user_metadata` özelliğini kullanarak `role`'ü direkt Supabase'de saklayabiliriz. Bu durumda ayrı `User` tablosuna ihtiyaç kalmaz.

### Avantajlar:
- ✅ Tek kaynak (Supabase Auth)
- ✅ Senkronizasyon sorunu yok
- ✅ Daha basit yapı

### Dezavantajlar:
- ❌ Prisma ile direkt erişim yok (Supabase Client kullanmak gerekir)
- ❌ Type safety zayıf
- ❌ Relation'lar zor (Enrollment gibi)

## Nasıl Çalışır?

### 1. Role'ü user_metadata'da Saklama

```typescript
// Register sırasında
await supabase.auth.signUp({
  email: formData.email,
  password: formData.password,
  options: {
    data: {
      name: formData.name,
      role: 'MEMBER' // user_metadata'da saklanır
    }
  }
})
```

### 2. Role'ü Okuma

```typescript
const { data: { user } } = await supabase.auth.getUser()
const role = user?.user_metadata?.role || 'MEMBER'
```

### 3. Role Güncelleme

```typescript
await supabase.auth.updateUser({
  data: {
    role: 'ADMIN'
  }
})
```

## Mevcut Yaklaşım vs Alternatif

| Özellik | Mevcut (Ayrı Tablo) | Alternatif (user_metadata) |
|---------|---------------------|---------------------------|
| Prisma ile çalışma | ✅ Kolay | ❌ Zor |
| Type safety | ✅ Güçlü | ⚠️ Zayıf |
| Relation'lar | ✅ Kolay | ❌ Zor |
| Senkronizasyon | ⚠️ Gerekli | ✅ Gerekmez |
| Custom field'lar | ✅ Kolay | ⚠️ Sınırlı |

## Öneri

**Mevcut yaklaşımı (ayrı User tablosu) kullanmaya devam edin** çünkü:
1. Prisma ile çalışmak çok daha kolay
2. Type safety sağlar
3. Enrollment gibi relation'lar için gerekli
4. Trigger ile otomatik senkronizasyon zaten var

Eğer sadece authentication yapıyorsanız ve role/relation gibi özelliklere ihtiyacınız yoksa, alternatif yaklaşımı kullanabilirsiniz.

