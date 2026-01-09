// Mevcut kullanıcıların role'lerini Supabase user_metadata'ya senkronize eder
// node scripts/sync-role-to-metadata.js

const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')

const prisma = new PrismaClient()

// Supabase client (service_role key gerekli - sadece server-side)
// Not: Bu script'i çalıştırmak için SUPABASE_SERVICE_ROLE_KEY gerekli
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli!')
  console.log('\n💡 .env.local dosyasına ekleyin:')
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function syncRolesToMetadata() {
  try {
    console.log('🔄 Role senkronizasyonu başlıyor...\n')

    // Tüm kullanıcıları al
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    })

    console.log(`📋 ${users.length} kullanıcı bulundu\n`)

    let successCount = 0
    let errorCount = 0

    for (const user of users) {
      try {
        // Update user metadata with role
        const { error } = await supabase.auth.admin.updateUserById(
          user.id,
          {
            user_metadata: {
              role: user.role,
              name: user.name,
            }
          }
        )

        if (error) {
          console.error(`❌ ${user.email}: ${error.message}`)
          errorCount++
        } else {
          console.log(`✅ ${user.email}: Role ${user.role} metadata'ya eklendi`)
          successCount++
        }
      } catch (error) {
        console.error(`❌ ${user.email}: ${error.message}`)
        errorCount++
      }
    }

    console.log(`\n✅ Başarılı: ${successCount}`)
    console.log(`❌ Hatalı: ${errorCount}`)
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

syncRolesToMetadata()



