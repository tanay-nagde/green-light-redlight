
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/utils/Db";
import { v4 as uuidv4 } from "uuid";
import { Player } from "@/utils/types/game";
import { signJwt } from '@/utils/jwt';
import { cookies } from "next/headers";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { gameId, name } = req.body as { gameId: string; name: string };
  const playerId = uuidv4();

  const newPlayer: Player = {
    name,
    score: 0,
    status: "playing",
    lastSeen: Date.now()
  };

  await db.collection("games").doc(gameId).collection("players").doc(playerId).set(newPlayer);
    // Sign JWT for the player
    const token = signJwt({ playerId, gameId, name });
    // set cookie
    const cookiestore = await cookies();
    cookiestore.set("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

  res.status(200).json({ playerId, token });
}
