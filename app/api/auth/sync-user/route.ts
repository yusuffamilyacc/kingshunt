import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * Mevcut Supabase Auth kullanıcılarını Prisma User tablosuna senkronize eder
 * Bu endpoint manuel olarak veya admin panelinden çağrılabilir
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      )
    }

    // Get user role from database to check if admin
    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true }
    })

    // Only admin can sync all users, regular users can only sync themselves
    const isAdmin = dbUser?.role === "ADMIN"
    const body = await request.json().catch(() => ({}))
    const targetUserId = body.userId || authUser.id

    if (!isAdmin && targetUserId !== authUser.id) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 403 }
      )
    }

    // For now, we'll use the current user's session
    // Admin API requires service_role key which should be server-side only
    // If you need to sync other users, use the Supabase Dashboard or create a server-side admin function
    let targetUser = null
    
    if (targetUserId === authUser.id) {
      // Use current user
      targetUser = authUser
    } else if (isAdmin) {
      // For admin, we can't use admin API without service_role key
      // Return error suggesting to use Supabase Dashboard or manual sync
      return NextResponse.json(
        { 
          error: "Admin API için service_role key gerekli. Lütfen Supabase Dashboard'dan veya SQL ile senkronize edin.",
          hint: "scripts/sync-existing-users.sql dosyasını kullanın"
        },
        { status: 400 }
      )
    }

    if (!targetUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Check if user exists in Prisma
    const existingUser = await prisma.user.findUnique({
      where: { id: targetUser.id }
    })

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { id: targetUser.id },
        data: {
          email: targetUser.email || existingUser.email,
          name: targetUser.user_metadata?.name || existingUser.name,
        }
      })

      return NextResponse.json({
        message: "Kullanıcı güncellendi",
        user: updatedUser
      })
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          id: targetUser.id,
          email: targetUser.email || "",
          name: targetUser.user_metadata?.name || null,
          role: "MEMBER",
        }
      })

      return NextResponse.json({
        message: "Kullanıcı oluşturuldu",
        user: newUser
      })
    }
  } catch (error) {
    console.error("Sync user error:", error)
    return NextResponse.json(
      { error: "Kullanıcı senkronizasyonu sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}

/**
 * Tüm Supabase Auth kullanıcılarını listeler (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      )
    }

    // Check if admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (dbUser?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 403 }
      )
    }

    // Get all users from Supabase Auth (requires admin client)
    // Note: This requires service_role key, which should be server-side only
    // For now, return Prisma users
    const prismaUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      users: prismaUsers,
      message: "Kullanıcılar listelendi"
    })
  } catch (error) {
    console.error("List users error:", error)
    return NextResponse.json(
      { error: "Kullanıcılar yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

