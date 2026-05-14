import { NextRequest, NextResponse } from "next/server"

const demoResponses = [
  "Bra fråga! 👋 Låt oss ta det steg för steg.\n\nAndragradsekvationer har formen ax² + bx + c = 0.\n\nFörsta steget är att identifiera koefficienterna a, b och c. Kan du se vilka de är i din ekvation?",
  "Precis rätt! Pq-formeln används när vi har en ekvation på formen x² + px + q = 0.\n\nFormeln är:\nx = -p/2 ± √((p/2)² - q)\n\nVill du att jag visar ett exempel?",
  "Det här är en viktig insikt! 💡\n\nNär diskriminanten (det som står under rottecknet) är:\n• Positivt → två lösningar\n• Noll → en lösning\n• Negativt → inga reella lösningar\n\nVilket fall tror du din ekvation har?",
  "Bra jobbat! Du börjar verkligen förstå det här. 🎉\n\nFör att säkra betyg C behöver du kunna:\n1. Lösa andragradsekvationer med pq-formeln\n2. Använda nollproduktmetoden\n3. Tolka grafiskt vad lösningarna betyder\n\nVill du öva på något av dessa?",
  "Absolut! Här är en övningsuppgift:\n\nLös ekvationen: x² - 5x + 6 = 0\n\nTips: Testa först att faktorisera innan du använder pq-formeln. Vad får du om du letar efter två tal som multiplicerade ger 6 och adderade ger -5?",
]

let demoIndex = 0

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body

    await new Promise((resolve) => setTimeout(resolve, 800))

    const response = demoResponses[demoIndex % demoResponses.length]
    demoIndex++

    return NextResponse.json({
      conversationId: "demo-conv-1",
      message: response,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Något gick fel med AI-tutorn" },
      { status: 500 }
    )
  }
}
