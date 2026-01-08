import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Giriş yapmanız gerekiyor" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if enrollment exists and user has permission
    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: "Kayıt bulunamadı" },
        { status: 404 }
      )
    }

    // Get user role from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    // Only admin or the owner can delete
    if (dbUser?.role !== "ADMIN" && enrollment.userId !== user.id) {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 403 }
      )
    }

    await prisma.enrollment.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Kayıt silindi" })
  } catch (error) {
    console.error("Error deleting enrollment:", error)
    return NextResponse.json(
      { error: "Kayıt silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
