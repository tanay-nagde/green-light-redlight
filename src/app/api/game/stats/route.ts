import { NextRequest } from "next/server";
import db from "@/utils/Db";
import { GameStateenum, Player } from "@/utils/types/game";

// SSE helper
function sendSSE(res: any, data: any) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return new Response(JSON.stringify({ error: "gameId is required" }), { status: 400 });
  }

  // Create a ReadableStream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Firestore real-time listener
      const unsubscribe = db
        .collection("games")
        .doc(gameId)
        .collection("players")
        .onSnapshot((snapshot) => {
          const players = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Player) }));
          const onlineCount = players.filter(p => p.status === GameStateenum.PLAYING).length;
          const eliminatedCount = players.filter(p => p.status === GameStateenum.OVER).length;

          const payload = { onlineCount, eliminatedCount, players };

          // Send SSE data
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        }, (error) => {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`));
        });

      // Cleanup when client disconnects
      req.signal.addEventListener("abort", () => {
        unsubscribe();
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
