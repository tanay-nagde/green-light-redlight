
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "./Navbar";
import GameArea from "./GameArea";
import WinModal from "./Winmodal";
import GameOverModal from "./Gameover";

import useTimer from "./hooks/useTimer";
import useLight from "./hooks/useLight";
import useProgress from "./hooks/useProgress";

const Game = () => {
  const router = useRouter();

  const { timer, startTimer, stopTimer, formatTime } = useTimer();
  const { light, gameState, startLightCycle, stopLightCycle } = useLight();
  const { progress, startProgress, stopProgress, resetProgress } = useProgress();

  const [isHolding, setIsHolding] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameResult, setGameResult] = useState<"playing" | "over" | "won">(
    "playing"
  );

  // Start game
  const handleMouseDown = () => {
    if (!gameStarted && gameResult === "playing") {
      setGameStarted(true);
      startTimer();
      startLightCycle();
    }
    setIsHolding(true);
  };

  // Stop holding
  const handleMouseUp = () => {
    setIsHolding(false);
    stopProgress();
  };

  // Handle holding logic
  useEffect(() => {
    if (!isHolding || gameResult !== "playing") return;

    if (gameState === "green") {
      startProgress((val) => {
        if (val >= 100) {
          setGameResult("won");
          setGameStarted(false);
          stopTimer();
          stopLightCycle();
        }
      });
    } else if (gameState === "red") {
      setGameResult("over");
      setGameStarted(false);
      stopTimer();
      stopLightCycle();
    }
  }, [isHolding, gameState, gameResult]);

  // Auto redirect when won
  useEffect(() => {
    if (gameResult === "won") {
      const timeout = setTimeout(() => {
        router.push("/leaderboard");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [gameResult, router]);

  //auto gameover when timer is 60s
  useEffect(() => {
    if (timer === 60) {
      setGameResult("over");
      setGameStarted(false);
      stopTimer();
      stopLightCycle();
    }
  }, [timer]);

return (
  <div className="min-h-screen bg-[#1A212D] text-white relative overflow-hidden">

    <GameArea
      timer={timer}
      formatTime={formatTime}
      light={light}
      gameState={gameState}
      progress={progress}
      isHolding={isHolding}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      gameResult={gameResult}
    />

    {gameResult === "over" && <GameOverModal />}
    {gameResult === "won" && <WinModal />}
  </div>
);
};

export default Game;
