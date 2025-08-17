import React from "react";
import { Hand } from "lucide-react";

type Props = {
  timer: number;
  formatTime: (s: number) => string;
  light: "green" | "red";
  gameState: "green" | "red";
  progress: number;
  isHolding: boolean;
  gameResult: "playing" | "over" | "won";
  onMouseDown: () => void;
  onMouseUp: () => void;
};

const GameArea = ({
  timer,
  formatTime,
  light,
  gameState,
  progress,
  isHolding,
  onMouseDown,
  onMouseUp,
  gameResult,
}: Props) => (
  <div className="flex-1 flex flex-col items-center justify-center px-6">
    {/* Timer */}
    <div className="my-4">
      <div className="text-2xl font-bold text-center">{formatTime(timer)}</div>
      <div className="text-slate-300 text-xs text-center">Time</div>
    </div>

    {/* Lights */}
    <div className="bg-slate-700/80 rounded-3xl p-4 border-2 border-slate-600 shadow-2xl my-4">
      <div className="space-y-2">
        <div
          className={`w-12 h-12 rounded-full ${
            light === "red"
              ? "bg-red-500 shadow-red-500/50 animate-pulse"
              : "bg-red-900/30 border border-red-800/50"
          }`}
        />
        <div
          className={`w-12 h-12 rounded-full ${
            light === "green"
              ? "bg-emerald-400 shadow-emerald-400/50 animate-pulse"
              : "bg-emerald-900/30 border border-emerald-800/50"
          }`}
        />
      </div>
    </div>

    {/* Status */}
    <div className="text-center mb-10">
      <div
        className={`text-3xl font-bold ${
          gameState === "green" ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {gameState === "green" ? "GREEN LIGHT" : "RED LIGHT"}
      </div>
      <div className="text-slate-400 text-lg">
        {gameState === "green" ? "GO!" : "STOP!"}
      </div>
    </div>

    {/* Progress */}
    <div className="w-full max-w-md mb-4">
      <div className="relative h-4 bg-slate-700 rounded-full">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
        <img
          src="/assets/player.png"
          alt="runner"
          className="absolute top-1/2 -translate-y-6 w-16 h-16"
          style={{ left: `calc(${progress}% - 16px)` }}
        />
      </div>
      <div className="flex justify-between text-sm text-slate-400 mt-1">
        <span>Start</span>
        <span>{Math.round(progress)}%</span>
        <span>Finish</span>
      </div>
    </div>

    {/* Button */}
    <button
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      disabled={gameResult !== "playing"}
      className={`relative w-40 h-40 rounded-full border-4 ${
        isHolding
          ? "bg-emerald-500/20 border-emerald-400 scale-95 shadow-lg"
          : "bg-slate-700/50 border-slate-600 hover:border-slate-500"
      } ${gameResult !== "playing" ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Hand size={50} />
        <div className="text-lg font-semibold">TAP & HOLD</div>
        <div className="text-sm text-slate-400">TO MOVE</div>
      </div>
      {isHolding && gameResult === "playing" && (
        <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
      )}
    </button>
  </div>
);

export default GameArea;
