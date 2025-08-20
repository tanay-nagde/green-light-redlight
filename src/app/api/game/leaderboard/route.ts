import { NextResponse } from "next/server";
import db from "@/utils/Db"; // firebase-admin db
import { GameStateenum } from "@/utils/types/game";

// SSE headers
const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const gameId = url.searchParams.get("gameId");
  const playerId = url.searchParams.get("playerId");

  if (!gameId || !playerId) {
    return new Response(JSON.stringify({ error: "Missing gameId or playerId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const playersRef = db.collection("games").doc(gameId).collection("players");

  return new Response(
    new ReadableStream({
      async start(controller) {
        const send = (data: any) => {
          const payload = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(new TextEncoder().encode(payload));
        };

        // Firestore snapshot listener
        const unsubscribe = playersRef.onSnapshot(snapshot => {
          const players = snapshot.docs.map(doc => ({
            playerId: doc.id,
            ...doc.data(),
          })) as Array<{ playerId: string; score: number; state: string; timer?: number }>;

          // Sort: winners first (timer ascending), then others by score descending
          players.sort((a, b) => {
            const aWon = a.state === GameStateenum.WON;
            const bWon = b.state === GameStateenum.WON;

            if (aWon && !bWon) return -1;
            if (!aWon && bWon) return 1;

            if (aWon && bWon) {
              return (a.timer ?? Infinity) - (b.timer ?? Infinity);
            }

            return b.score - a.score;
          });

          // Top 25 leaderboard
          const leaderboard = players.slice(0, 25);
          const requestingPlayer = players.find(p => p.playerId === playerId);

          send({
            leaderboard,
            player: requestingPlayer
              ? {
                  playerId: requestingPlayer.playerId,
                  score: requestingPlayer.score,
                  state: requestingPlayer.state,
                  timer: requestingPlayer.timer ?? null,
                }
              : null,
          });
        });

        // Close stream on client disconnect
        req.signal.addEventListener("abort", () => {
          unsubscribe();
          controller.close();
        });
      },
    }),
    { headers: SSE_HEADERS }
  );
}
