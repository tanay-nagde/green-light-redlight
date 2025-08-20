"use client";

import React, { useEffect, useState } from "react";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LeaderboardList from "@/components/LeaderboardList";
import Stats from "@/components/Stats";
import { useParams, useSearchParams } from "next/navigation";

type LeaderboardItem = {
  playerId: string;
  score: number;
  state: string;
  timer?: number | null;
  name?: string;
};

const Page = () => {
  const params = useParams();
  const sessionId = params?.session as string;
  const searchParams = useSearchParams();
  const playerId = searchParams.get("playerId") ?? "";

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [player, setPlayer] = useState<LeaderboardItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerRank, setPlayerRank] = useState<number | null>(null);
  const [totalOnline, setTotalOnline] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId || !playerId) return;

    setLoading(true);

    const sseUrl = `/api/game/leaderboard?gameId=${sessionId}&playerId=${playerId}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const topPlayers: LeaderboardItem[] = data.leaderboard || [];
      setLeaderboard(topPlayers);

      const currentPlayer: LeaderboardItem | null = data.player || null;
      setPlayer(currentPlayer);

      // Player rank in the top 25
      const rankIndex = topPlayers.findIndex((p) => p.playerId === playerId);
      setPlayerRank(rankIndex >= 0 ? rankIndex + 1 : null);

      // Best time among finished players
      const finishedPlayers = topPlayers.filter((p) => p.timer != null);
      const minTime = finishedPlayers.length
        ? Math.min(...finishedPlayers.map((p) => p.timer!))
        : null;
      setBestTime(minTime);

      setTotalOnline(topPlayers.length); // optional, or get from separate SSE
      setLoading(false);
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
      setLoading(false);
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, [sessionId, playerId]);

  return (
    <div className="min-h-screen bg-[#1A212D] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700/50">
        <Link
          href={`/multiplayer/${sessionId}`}
          className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Game</span>
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-bold bg-emerald-400 bg-clip-text text-transparent">
            LEADERBOARD
          </h1>
          <p className="text-gray-400">Top Players</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-5 h-5" />
          <span>{totalOnline} online</span>
        </div>
      </div>

      {/* Stats Summary */}
      <Stats totalOnline={totalOnline} bestTime={bestTime} />

      {/* Leaderboard List */}
      <LeaderboardList players={leaderboard} loading={loading} />

      {/* Your Rank */}
      {player && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1F2A38]/50 backdrop-blur-sm border-t border-slate-700/50 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-semibold">Your Rank</div>
                <div className="text-sm text-gray-400">
                  {playerRank ? `#${playerRank}` : "Not in Top 25"} — {player.name ?? player.playerId} ({player.state})
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-emerald-400">{player.score} pts</div>
              {player.timer != null && (
                <div className="text-sm text-gray-400">Best: {player.timer}s</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
