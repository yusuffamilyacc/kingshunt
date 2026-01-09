import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

/**
 * Middleware edge runtime için role kontrolü
 * Prisma edge runtime'da çalışmadığı için API route üzerinden role kontrolü
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { role: null },
        { status: 200 }
      )
    }

    // Get role from Prisma (server-side, edge değil)
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    // Also update metadata if different
    if (dbUser && user.user_metadata?.role !== dbUser.role) {
      await supabase.auth.updateUser({
        data: {
          role: dbUser.role,
        }
      })
    }

    return NextResponse.json({
      role: dbUser?.role || user.user_metadata?.role || 'MEMBER',
      userId: user.id
    })
  } catch (error) {
    console.error("Error checking role:", error)
    return NextResponse.json(
      { role: null },
      { status: 200 }
    )
  }
}



