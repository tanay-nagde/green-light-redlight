import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/Db"; // firebase-admin db
import { GameStateenum } from "@/utils/types/game";

export async function POST(req: NextRequest) {
  try {
    const { gameId, playerId } = await req.json() as {
      gameId: string;
      playerId: string;
    };

    if (!gameId || !playerId) {
      return NextResponse.json({ error: "Missing gameId or playerId" }, { status: 400 });
    }

    const playersRef = db
      .collection("games")
      .doc(gameId)
      .collection("players");

    const snapshot = await playersRef.get();

    let players = snapshot.docs.map(doc => ({
      playerId: doc.id,
      ...doc.data(),
    })) as Array<{
      playerId: string;
      score: number;
      state: string;
      timer?: number;
    }>;

    // Sort logic:
    // 1. WON players first, sorted by timer ASC (smaller = better)
    // 2. Remaining players sorted by score DESC
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

    // Top 10 leaderboard
    const leaderboard = players.slice(0, 10);

    // Find requesting player's score (even if not in top 10)
    const requestingPlayer = players.find(p => p.playerId === playerId);

    return NextResponse.json({
      leaderboard,
      player: requestingPlayer ? {
        playerId: requestingPlayer.playerId,
        score: requestingPlayer.score,
        state: requestingPlayer.state,
        timer: requestingPlayer.timer ?? null,
      } : null,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
