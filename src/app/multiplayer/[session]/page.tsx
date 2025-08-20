"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/game/Navbar";
import GameArea from "@/components/game/GameArea";
import { GameStateenum } from "@/utils/types/game";
import { useDebounce } from "@/components/game/hooks/useDebounce";

const Page = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = (params.session as string) || "";
  const playerId = searchParams.get("playerId") || "";
  const playername = searchParams.get("name") || "";

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [state, setState] = useState<GameStateenum>(GameStateenum.PLAYING);
  const [onlineCount, setOnlineCount] = useState(0);
  const [eliminatedCount, setEliminatedCount] = useState(0);

  // Dialog state
  const [name, setName] = useState(playername);
  const [showDialog, setShowDialog] = useState(!playerId); // open dialog if no playerId
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/game/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: sessionId, name }),
      });

      if (!res.ok) {
        throw new Error("Failed to join game");
      }

      const { playerId } = await res.json();

      // full page reload so state resets
      window.location.replace(`/multiplayer/${sessionId}?playerId=${playerId}`);
    } catch (err) {
      console.error(err);
      alert("Error joining game");
    } finally {
      setLoading(false);
    }
  };

const updateScore = useDebounce(() => {
    fetch('/api/game/update', {
      method: 'POST',
      body: JSON.stringify({ score, timer: time, status:state, playerId, gameId: sessionId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }, 500);





  useEffect(() => {
    updateScore(); // Call the debounced function
  }, [score, state ]);

  // fetch stats from sse eventsource
  useEffect(() => {
  // Create an EventSource connection to the SSE endpoint
  const eventSource = new EventSource(`/api/game/stats?gameId=${sessionId}`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      setOnlineCount(data.onlineCount);
      setEliminatedCount(data.eliminatedCount);
    } catch (err) {
      console.error("Failed to parse SSE data:", err);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE connection error:", err);
    eventSource.close(); // Close on error
  };

  // Cleanup when component unmounts
  return () => {
    eventSource.close();
  };
}, [sessionId]);

  // Auto redirect after game ends
  useEffect(() => {
    if (state === GameStateenum.OVER || state === GameStateenum.WON) {
      const timer = setTimeout(() => {
        router.push(`/multiplayer/${sessionId}/leaderboard?playerId=${playerId}`);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state, router, sessionId]);

  return (
    <>
      <Navbar userName={name} playersOnline={onlineCount} playersEliminated={eliminatedCount} />

      {/* Show game area while playing */}
      {state === GameStateenum.PLAYING ? (
        <GameArea setScore={setScore} setTime={setTime} setState={setState} />
      ) : (
        // End screen after game over / won
        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            {state === GameStateenum.OVER ? "💀 Game Over!" : "🎉 You Won!"}
          </h2>
          <p className="text-lg text-gray-300 mb-6">Final Score: {score}</p>
          <button
            onClick={() =>
              router.push(`/multiplayer/${sessionId}/leaderboard?playerId=${playerId}`)
            }
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg shadow"
          >
            Go to Leaderboard
          </button>
          <p className="text-gray-400 mt-2 text-sm">
            Redirecting in 4 seconds...
          </p>
        </div>
      )}

      {/* Dialog for entering name */}
      {showDialog && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-[#1F2A38] p-6 rounded-xl w-80 text-center shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">Enter your name</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Your name"
            />
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-emerald-400 text-[#1A212D] font-bold py-2 px-4 rounded-lg hover:bg-emerald-300 transition"
            >
              {loading ? "Joining..." : "Join Game"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
