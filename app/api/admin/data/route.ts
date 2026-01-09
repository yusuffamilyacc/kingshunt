import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

// Dynamic route - uses cookies for auth
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch all data in parallel
    const [programs, tournaments, coaches, users, groups] = await Promise.all([
      prisma.program.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.tournament.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.coach.findMany({
        orderBy: [
          { type: "asc" },
          { createdAt: "desc" },
        ],
      }),
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          studentName: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.group.findMany({
        include: {
          program: {
            select: {
              id: true,
              title: true,
            },
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  studentName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ])

    return NextResponse.json({
      programs,
      tournaments,
      coaches,
      users,
      groups,
    })
  } catch (error) {
    console.error("Error fetching admin data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
