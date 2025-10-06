import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

type Client = {
  send: (data: string) => void
}

let clients: Client[] = []

supabase
  .channel("leaderboard-updates")
  .on("broadcast", { event: "refresh" }, (payload) => {
    for (const client of clients) {
      client.send(JSON.stringify({ message: "refresh", payload }))
    }
  })
  .subscribe()

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      const send = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }

      clients.push({ send })

      send(
        JSON.stringify({
          message: "connected",
        }),
      )

      const keepAlive = setInterval(() => {
        send(
          JSON.stringify({
            message: "ping",
          }),
        )
      }, 25000)

      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive)
        clients = clients.filter((c) => c.send !== send)
      })
    },
  })

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
