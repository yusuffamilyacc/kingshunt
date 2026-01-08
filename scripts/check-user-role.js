// Kullanıcının role'ünü kontrol etmek için
// node scripts/check-user-role.js YOUR-EMAIL@example.com

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkUserRole(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    })

    if (!user) {
      console.log(`❌ Kullanıcı bulunamadı: ${email}`)
      console.log('\n📋 Tüm kullanıcılar:')
      const allUsers = await prisma.user.findMany({
        select: {
          email: true,
          name: true,
          role: true,
        }
      })
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.name || 'No name'}) - Role: ${u.role}`)
      })
      return
    }

    console.log('\n✅ Kullanıcı Bilgileri:')
    console.log(`  ID: ${user.id}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Name: ${user.name || 'No name'}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  Created: ${user.createdAt}`)

    if (user.role !== 'ADMIN') {
      console.log('\n⚠️  Kullanıcı ADMIN değil!')
      console.log('\n💡 Admin yapmak için:')
      console.log('   1. Supabase SQL Editor\'de scripts/set-admin-role.sql dosyasını çalıştırın')
      console.log('   2. Veya şu SQL\'i çalıştırın:')
      console.log(`      UPDATE public."User" SET role = 'ADMIN' WHERE email = '${email}';`)
    } else {
      console.log('\n✅ Kullanıcı zaten ADMIN!')
    }
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]

if (!email) {
  console.log('📝 Kullanım: node scripts/check-user-role.js YOUR-EMAIL@example.com')
  console.log('\n📋 Tüm kullanıcıları listele:')
  prisma.user.findMany({
    select: {
      email: true,
      name: true,
      role: true,
    }
  }).then(users => {
    users.forEach(u => {
      console.log(`  - ${u.email} (${u.name || 'No name'}) - Role: ${u.role}`)
    })
    prisma.$disconnect()
  })
} else {
  checkUserRole(email)
}

