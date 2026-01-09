import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * Prisma User tablosundaki role'ü Supabase user_metadata'ya senkronize eder
 * Bu, middleware edge runtime'da role'ü okumak için gerekli
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      )
    }

    // Get role from Prisma
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      )
    }

    // Update user_metadata with role
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        role: dbUser.role,
      }
    })

    if (updateError) {
      return NextResponse.json(
        { error: "Role güncellenirken bir hata oluştu" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Role metadata'ya eklendi",
      role: dbUser.role
    })
  } catch (error) {
    console.error("Update role metadata error:", error)
    return NextResponse.json(
      { error: "Role güncellenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}



