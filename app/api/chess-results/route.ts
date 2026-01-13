import { NextRequest, NextResponse } from "next/server"

// Chess-results.com'dan turnuva verilerini çek
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tournamentUrl = searchParams.get("url")

    if (!tournamentUrl) {
      return NextResponse.json(
        { error: "Turnuva URL'i gereklidir" },
        { status: 400 }
      )
    }

    // Chess-results.com'dan HTML çek
    const response = await fetch(tournamentUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Turnuva verileri alınamadı" },
        { status: response.status }
      )
    }

    const html = await response.text()

    // HTML'den sporcu listesini parse et
    const players = parsePlayers(html)

    // Debug için
    console.log(`Parsed ${players.length} players from tournament`)

    if (players.length === 0) {
      // HTML'in bir kısmını logla (debug için)
      const tableMatch = html.match(/<table[^>]*>[\s\S]{0,2000}/i)
      const sampleHTML = tableMatch ? tableMatch[0].substring(0, 1000) : "No table found"
      console.log("Sample HTML:", sampleHTML)
      
      // Başlangıç sıralaması içeren bölümü kontrol et
      const hasRanking = html.includes("Başlangıç Sıralaması") || html.includes("No.") || html.includes("İsim")
      console.log("Has ranking section:", hasRanking)
      
      // Tüm tabloları say
      const allTables = html.match(/<table[^>]*>/gi) || []
      console.log(`Total tables found: ${allTables.length}`)
      
      // CRs1 class'ı olan tabloları say
      const crs1Tables = html.match(/class=["']CRs1["']/gi) || []
      console.log(`CRs1 tables found: ${crs1Tables.length}`)
      
      // HTML'de oyuncu isimlerini ara (örnek: "GECEGÖRMEZ")
      const hasPlayerNames = html.includes("GECEGÖRMEZ") || html.includes("SARI") || html.includes("ERDEM")
      console.log("Has player names in HTML:", hasPlayerNames)
    }

    return NextResponse.json({
      players,
    })
  } catch (error) {
    console.error("Error fetching chess-results data:", error)
    return NextResponse.json(
      { error: "Veri çekilirken bir hata oluştu" },
      { status: 500 }
    )
  }
}

// HTML'den sporcu listesini parse et
function parsePlayers(html: string) {
  const players: Array<{
    no: number
    name: string
    fideId: string
    fed: string
    elo: number
    ukd: number
    club: string
    detailUrl: string
  }> = []

  // Tüm tabloları bul
  const allTables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi) || []
  let targetTable: string | null = null

  // Önce class="CRs1" olan tabloyu ara (oyuncu listesi genellikle burada)
  for (const table of allTables) {
    if (table.match(/class=["']CRs1["']/i)) {
      targetTable = table
      console.log("Found CRs1 table")
      break
    }
  }

  // Eğer bulunamadıysa, "Başlangıç Sıralaması" veya sayısal sıra içeren tabloyu ara
  if (!targetTable) {
    for (const table of allTables) {
      const tableContent = table.toLowerCase()
      // Tablo içinde "başlangıç", "no.", "isim", "fide" gibi kelimeler varsa
      if (
        tableContent.includes("başlangıç") ||
        tableContent.includes("no.") ||
        tableContent.includes("isim") ||
        (tableContent.includes("fide") && tableContent.includes("elo"))
      ) {
        // Tabloda sayısal satırlar var mı kontrol et (oyuncu satırları genellikle sayı ile başlar)
        const rows = table.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || []
        let numericRows = 0
        for (const row of rows) {
          const firstCell = row.match(/<td[^>]*>([\s\S]*?)<\/td>/i)
          if (firstCell) {
            const text = firstCell[1].replace(/<[^>]*>/g, "").trim()
            if (text.match(/^\d+$/)) {
              numericRows++
            }
          }
        }
        // Eğer 5'ten fazla sayısal satır varsa, bu muhtemelen oyuncu listesi
        if (numericRows >= 5) {
          targetTable = table
          console.log(`Found table with ${numericRows} numeric rows`)
          break
        }
      }
    }
  }

  if (!targetTable) {
    console.log("No suitable table found. Total tables:", allTables.length)
    // Son çare: En büyük tabloyu al (genellikle oyuncu listesi en büyük tablodur)
    if (allTables.length > 0 && allTables[0]) {
      let largestTable = allTables[0]
      let largestSize = allTables[0].length
      for (const table of allTables) {
        if (table && table.length > largestSize) {
          largestSize = table.length
          largestTable = table
        }
      }
      targetTable = largestTable
      console.log("Using largest table as fallback")
    }
  }

  if (!targetTable) {
    console.log("No table found in HTML")
    return players
  }

  // Tablo içeriğinin bir kısmını logla (ilk 2000 karakter)
  console.log("Target table sample (first 2000 chars):", targetTable.substring(0, 2000))

  const rows = targetTable.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || []
  console.log(`Found ${rows.length} rows in target table`)

  // İlk 5 satırı logla (debug için)
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const sampleRow = rows[i].substring(0, 200)
    console.log(`Row ${i} sample: ${sampleRow}...`)
  }

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]
    
    // Başlık satırını atla
    if (row.includes("<th")) {
      if (rowIndex < 3) {
        console.log(`Skipping th row ${rowIndex}`)
      }
      continue
    }

    // Başlık satırı kontrolü - "No." ve "İsim" içeriyorsa atla
    const rowText = row.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").toLowerCase().trim()
    if (rowText.includes("no.") && (rowText.includes("isim") || rowText.includes("name") || rowText.includes("fide"))) {
      if (rowIndex < 3) {
        console.log(`Skipping header row ${rowIndex}: ${rowText.substring(0, 80)}`)
      }
      continue
    }

    const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || []
    if (cells.length < 3 || !cells[0]) {
      if (rowIndex < 5) {
        console.log(`Row ${rowIndex} has only ${cells.length} cells, skipping`)
      }
      continue
    }

    // İlk hücre sayısal mı kontrol et (oyuncu satırları genellikle sayı ile başlar)
    const firstCellText = cells[0].replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
    const firstCellNumber = parseInt(firstCellText)
    
    if (!firstCellText.match(/^\d+$/) || isNaN(firstCellNumber) || firstCellNumber === 0) {
      // İlk hücre sayı değilse, bu muhtemelen başlık veya boş satır
      if (rowIndex < 5) {
        console.log(`Skipping row ${rowIndex}: first cell is "${firstCellText}" (not a number)`)
      }
      continue
    }

    // Hücre içeriklerini temizle
    const getCellText = (cell: string) => {
      // Önce tüm HTML etiketlerini kaldır
      let text = cell.replace(/<[^>]*>/g, "")
      // HTML entity'leri decode et
      text = text
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
      // Çoklu boşlukları tek boşluğa çevir
      text = text.replace(/\s+/g, " ")
      return text.trim()
    }

    // Sıra: İlk hücre genellikle numara
    const noText = getCellText(cells[0] || "")
    const no = parseInt(noText) || 0
    
    // İsim ve detay URL'ini bul - CRdb class'ına sahip link'i ara
    let name = ""
    let detailUrl = ""
    
    // Tüm hücrelerde CRdb class'ına sahip link'i ara
    for (const cell of cells) {
      // CRdb class'ına sahip link'i bul
      const crdbLinkMatch = cell.match(/<a[^>]*class=["'][^"']*CRdb[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i)
      if (crdbLinkMatch) {
        detailUrl = crdbLinkMatch[1]
        name = getCellText(crdbLinkMatch[2] || "")
        
        // HTML entity'leri decode et (href için)
        detailUrl = detailUrl
          .replace(/&amp;/g, "&")
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"')
        
        // Relative URL ise base URL ekle
        if (detailUrl.startsWith("/") || detailUrl.startsWith("./")) {
          detailUrl = `https://s2.chess-results.com${detailUrl.startsWith("./") ? detailUrl.substring(1) : detailUrl}`
        } else if (!detailUrl.startsWith("http")) {
          detailUrl = `https://s2.chess-results.com/${detailUrl}`
        }
        
        break
      }
    }
    
    // Eğer CRdb link bulunamadıysa, ikinci hücreden ismi al
    if (!name && cells[1]) {
      name = getCellText(cells[1])
      // Link text'ini dene
      if (!name || name.trim() === "") {
        const linkMatch = cells[1].match(/<a[^>]*>([\s\S]*?)<\/a>/i)
        if (linkMatch && linkMatch[1]) {
          name = getCellText(linkMatch[1])
        }
      }
      // Hala boşsa, tüm hücreyi al
      if (!name || name.trim() === "") {
        name = cells[1].replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
      }
    }
    
    if (!name || name.trim() === "" || no === 0) {
      if (rowIndex < 5) {
        console.log(`Skipping row ${rowIndex}: no=${no}, name="${name}", detailUrl="${detailUrl}"`)
      }
      continue
    }
    
    // İlk birkaç oyuncuyu logla
    if (players.length < 3) {
      console.log(`Parsing player ${no}: ${name}, cells: ${cells.length}`)
      // İlk 5 hücrenin içeriğini göster
      const cellContents = cells.slice(0, 7).map((c, idx) => {
        const text = c.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().substring(0, 40)
        return `Cell[${idx}]: "${text}"`
      }).join(" | ")
      console.log(`Cell contents: ${cellContents}`)
    }

    // FIDE ID, FED, ELO, UKD, Club - sıra değişebilir
    let fideId = ""
    let fed = ""
    let elo = 0
    let ukd = 0
    let club = ""

    // Chess-results.com formatı genellikle: No | İsim | FIDE ID | FED | ELO | UKD | Kulüp
    // Hücre sayısına göre formatı belirle
    if (cells.length >= 7) {
      // Tam format: No, İsim, FIDE ID, FED, ELO, UKD, Kulüp
      fideId = getCellText(cells[2]) || ""
      fed = getCellText(cells[3]) || ""
      const eloText = getCellText(cells[4])
      const ukdText = getCellText(cells[5])
      club = getCellText(cells[6]) || ""
      
      elo = parseInt(eloText) || 0
      ukd = parseInt(ukdText) || 0
    } else if (cells.length >= 6) {
      // Format: No, İsim, FIDE ID, FED, ELO/UKD, Kulüp
      fideId = getCellText(cells[2]) || ""
      fed = getCellText(cells[3]) || ""
      const ratingText = getCellText(cells[4])
      club = getCellText(cells[5]) || ""
      
      const rating = parseInt(ratingText) || 0
      // ELO mu UKD mi olduğunu tahmin et
      if (rating >= 1000 && rating <= 3000) {
        elo = rating
      } else {
        ukd = rating
      }
    } else if (cells.length >= 5) {
      // Format: No, İsim, FIDE ID, FED, ELO/UKD
      fideId = getCellText(cells[2]) || ""
      fed = getCellText(cells[3]) || ""
      const ratingText = getCellText(cells[4])
      
      const rating = parseInt(ratingText) || 0
      if (rating >= 1000 && rating <= 3000) {
        elo = rating
      } else {
        ukd = rating
      }
    } else {
      // Hücreleri sırayla kontrol et (fallback)
      for (let i = 2; i < cells.length; i++) {
        const text = getCellText(cells[i])
        if (!text) continue
        
        // FIDE ID formatı: TUR01439, TUR01334 gibi (3 harf + sayı)
        if (text.match(/^[A-Z]{2,3}\d{4,}$/i)) {
          fideId = text.toUpperCase()
        }
        // FED: 2-3 harfli ülke kodu (TUR, GER, etc.)
        else if (text.match(/^[A-Z]{2,3}$/i) && text.length >= 2 && text.length <= 3 && !fed) {
          fed = text.toUpperCase()
        }
        // ELO/UKD: Sayı
        else if (text.match(/^\d+$/)) {
          const num = parseInt(text)
          if (num >= 1000 && num <= 3000 && elo === 0) {
            elo = num
          } else if (num > 0 && num < 10000 && ukd === 0) {
            ukd = num
          }
        }
        // Club/Şehir: Diğer metin
        else if (text.length > 2 && !club && !text.match(/^\d+$/) && !text.match(/^[A-Z]{2,3}$/i)) {
          club = text
        }
      }
    }

    // Eğer UKD bulunamadıysa ve ELO varsa, ELO'yu UKD olarak kullan
    if (ukd === 0 && elo > 0) {
      ukd = elo
    }

    players.push({
      no,
      name,
      fideId: fideId || "",
      fed: fed || "",
      elo,
      ukd,
      club: club || "",
      detailUrl: detailUrl || "",
    })
  }

  return players
}

// Sporcu detay sayfasından maç sonuçlarını parse et
export async function parsePlayerMatches(detailUrl: string, playerName: string) {
  const matches: Array<{
    round: number
    opponent: string
    opponentUKD: number
    result: number // 1 = kazanç, 0.5 = beraberlik, 0 = kayıp
    color: "white" | "black"
  }> = []

  try {
    const response = await fetch(detailUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      return matches
    }

    const html = await response.text()

    // Maç sonuçları tablosunu bul (genellikle CRs1 veya benzer class)
    const tableRegex = /<table[^>]*class=["']CRs1["'][^>]*>([\s\S]*?)<\/table>/i
    const tableMatch = html.match(tableRegex)
    
    if (!tableMatch) {
      return matches
    }

    const tableContent = tableMatch[1]
    const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || []

    for (const row of rows) {
      // Başlık satırını atla
      if (row.includes("<th")) continue

      const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || []
      if (cells.length < 4) continue

      const getCellText = (cell: string) => {
        return cell
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .trim()
      }

      // Tur numarası
      const roundText = getCellText(cells[0] || "")
      const round = parseInt(roundText) || 0

      // Rakip ismi
      const opponent = getCellText(cells[1]) || getCellText(cells[2]) || ""

      // Renk (Beyaz/Siyah)
      const colorText = getCellText(cells[2]) || getCellText(cells[3]) || ""
      const color = colorText.toLowerCase().includes("beyaz") || colorText.toLowerCase().includes("white") ? "white" : "black"

      // Sonuç
      const resultText = getCellText(cells[cells.length - 1]) || ""
      let result = 0.5 // Beraberlik default
      
      if (resultText.includes("1-0")) {
        result = color === "white" ? 1 : 0
      } else if (resultText.includes("0-1")) {
        result = color === "white" ? 0 : 1
      } else if (resultText.includes("½") || resultText.includes("0.5")) {
        result = 0.5
      }

      // Rakip UKD'sini bul (hücrelerden birinde olmalı)
      let opponentUKD = 0
      for (const cell of cells) {
        const text = getCellText(cell)
        const num = parseInt(text)
        if (num > 0 && num < 10000 && num !== round) {
          opponentUKD = num
          break
        }
      }

      if (round > 0 && opponent) {
        matches.push({
          round,
          opponent,
          opponentUKD,
          result,
          color,
        })
      }
    }
  } catch (error) {
    console.error("Error parsing player matches:", error)
  }

  return matches
}
