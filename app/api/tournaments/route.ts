import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const tournamentSchema = z.object({
  name: z.string().min(1, "Turnuva adı gereklidir"),
  date: z.string().transform((str) => new Date(str)),
  location: z.string().min(1, "Konum gereklidir"),
  type: z.string().min(1, "Tip gereklidir"),
  status: z.string().min(1, "Durum gereklidir"),
})

// Disable caching for dynamic data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      orderBy: { date: "desc" },
    })

    return NextResponse.json(tournaments, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error("Error fetching tournaments:", error)
    return NextResponse.json(
      { error: "Turnuvalar yüklenirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

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

    // Get user role from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Yetkisiz erişim" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = tournamentSchema.parse(body)

    const tournament = await prisma.tournament.create({
      data: validatedData,
    })

    return NextResponse.json(tournament, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Error creating tournament:", error)
    return NextResponse.json(
      { error: "Turnuva oluşturulurken bir hata oluştu" },
      { status: 500 }
    )
  }
}
