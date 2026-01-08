import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const registerSchema = z.object({
  id: z.string().min(1, "User ID gereklidir"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: validatedData.id }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu kullanıcı zaten kayıtlı" },
        { status: 400 }
      )
    }

    // Create user in Prisma (password is managed by Supabase Auth)
    const user = await prisma.user.create({
      data: {
        id: validatedData.id,
        name: validatedData.name,
        email: validatedData.email,
        role: "MEMBER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    // Update user_metadata with role (for middleware edge runtime)
    // Note: This requires the user to be authenticated, so we'll do it client-side
    // Or use a server-side function with service_role key

    return NextResponse.json(
      { message: "Kayıt başarılı", user },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu" },
      { status: 500 }
    )
  }
}
