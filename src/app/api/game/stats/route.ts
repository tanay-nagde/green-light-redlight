import { NextRequest, NextResponse } from "next/server";
import  db  from "@/utils/Db";
import { GameStateenum, Player } from "@/utils/types/game";

export async function POST(req: NextRequest) {
    try {

        const {gameId} = await req.json() as {gameId: string};

        if (!gameId) {
            return NextResponse.json({ error: "gameId is required" }, { status: 400 });
        }

        const playersSnap = await db.collection("games").doc(gameId).collection("players").get();
        const players = playersSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Player) }));

        const onlineCount = players.filter(p => p.status === GameStateenum.PLAYING).length;
        const eliminatedCount = players.filter(p => p.status === GameStateenum.OVER).length;

      
        return NextResponse.json({ onlineCount, eliminatedCount });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}