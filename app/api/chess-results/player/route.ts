import { NextRequest, NextResponse } from "next/server"
import { parsePlayerMatches } from "../route"

// Sporcu detay sayfasından maç sonuçlarını çek
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const detailUrl = searchParams.get("url")
    const playerName = searchParams.get("name") || ""

    if (!detailUrl) {
      return NextResponse.json(
        { error: "Sporcu detay URL'i gereklidir" },
        { status: 400 }
      )
    }

    const matches = await parsePlayerMatches(detailUrl, playerName)

    return NextResponse.json({
      matches,
    })
  } catch (error) {
    console.error("Error fetching player matches:", error)
    return NextResponse.json(
      { error: "Maç sonuçları çekilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
