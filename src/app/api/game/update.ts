import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/utils/Db";   
import { Player, LeaderboardEntry } from "@/utils/types/game";

interface UpdateResponse {
  onlineCount: number;
  eliminatedCount: number;
  leaderboard: LeaderboardEntry[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<UpdateResponse | { error: string }>) {
  if (req.method !== "POST") return res.status(405).end();

  const { gameId, playerId, score, status } = req.body as {
    gameId: string;
    playerId: string;
    score: number;
    status: Player["status"];
  };

  const playerRef = db.collection("games").doc(gameId).collection("players").doc(playerId);

  await playerRef.set(
    {
      score,
      status,
      lastSeen: Date.now()
    },
    { merge: true }
  );

  const playersSnap = await db.collection("games").doc(gameId).collection("players").get();
  const players = playersSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as Player) }));

  const onlineCount = players.filter(p => p.status === "playing").length;
  const eliminatedCount = players.filter(p => p.status === "eliminated").length;

  const leaderboard = players
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  res.status(200).json({ onlineCount, eliminatedCount, leaderboard });
}
