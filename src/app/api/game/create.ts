import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/utils/Db";
import { Game } from "@/utils/types/game";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const expiresAt = Date.now() + 5 * 60 * 1000;

  const newGame: Game = {
    createdAt: Date.now(),
    expiresAt,
    status: "active"
  };

  const gameRef = await db.collection("games").add(newGame);

  res.status(200).json({ gameId: gameRef.id, expiresAt });
}
