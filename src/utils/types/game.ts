export type GameStatus = "active" | "finished";
export type PlayerStatus = "playing" | "eliminated";

export interface Game {
  createdAt: number;      // timestamp (ms since epoch)
  expiresAt: number;      // timestamp
  status: GameStatus;
}

export interface Player {
  name: string;
  score: number;
  status: PlayerStatus;
  lastSeen: number;       // timestamp
}

export interface LeaderboardEntry extends Player {
  id: string;             // playerId
}
