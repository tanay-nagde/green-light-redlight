import { NextRequest, NextResponse } from "next/server";
import  db  from "@/utils/Db";
import { Player, LeaderboardEntry } from "@/utils/types/game";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const gameId = url.searchParams.get("gameId");

        if (!gameId) {
            return NextResponse.json({ error: "gameId is required" }, { status: 400 });
        }

        const playersSnap = await db.collection("games").doc(gameId).collection("players").get();
        const players = playersSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Player) }));

        const onlineCount = players.filter(p => p.status === "playing").length;
        const eliminatedCount = players.filter(p => p.status === "eliminated").length;

        const leaderboard = players
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(p => ({
                id: p.id,
                name: p.name,
                score: p.score,
                timer: p.timer || null // Add timer to leaderboard if it exists
            }));

        return NextResponse.json({ onlineCount, eliminatedCount, leaderboard });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}