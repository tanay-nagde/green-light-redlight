"use client"
import React, { useState, useEffect } from 'react';
import { Users, Trophy, Hand, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const Page = () => {
  const [gameState, setGameState] = useState('green'); // 'green' or 'red'
  const [timer, setTimer] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Mock data
  const userName = "Mandeep";
  const playersOnline = 127;

  // Game timer countdown
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver]);

  // Random light changes
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const lightInterval = setInterval(() => {
        setGameState(prev => prev === 'green' ? 'red' : 'green');
      }, Math.random() * 3000 + 2000); // 2-5 seconds random
      
      return () => clearInterval(lightInterval);
    }
  }, [gameStarted, gameOver]);

  // Progress update when holding
  useEffect(() => {
    if (isHolding && gameState === 'green' && !gameOver) {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.5;
          if (newProgress >= 100) {
            setGameStarted(false);
            return 100;
          }
          return newProgress;
        });
      }, 50);
      
      return () => clearInterval(progressInterval);
    }

    // 🚨 Detect cheating (holding on red)
    if (isHolding && gameState === 'red' && !gameOver) {
      setGameOver(true);
      setGameStarted(false);
    }

  }, [isHolding, gameState, gameOver]);

  const handleMouseDown = () => {
    if (!gameStarted && !gameOver) {
      setGameStarted(true);
    }
    setIsHolding(true);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#1A212D] text-white relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 flex justify-between items-center px-4 py-2 bg-[#1F2A38]">
        <div>
          <div className="text-white">{userName}</div>
        </div>
        <div className='translate-x-16/14'> 
          <div className="text-2xl font-bold text-center">{formatTime(timer)}</div>
          <div className="text-slate-300 text-xs text-center">Time</div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-emerald-400" />
            <div className='space-x-1'>
              <span className="text-white font-semibold">{playersOnline}</span>
              <span className="text-slate-300 text-xs">online</span>
            </div>
          </div>
          
          <div>
            <Link href={"/leaderboard"} className="flex items-center gap-2">
              <Trophy size={16} className="text-yellow-400" />
              <span className="text-slate-300 hover:text-slate-400 text-sm">Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="my-4">
          <div className="relative">
            <div className="bg-slate-700/80 backdrop-blur-sm rounded-3xl p-4 border-2 border-slate-600 shadow-2xl">
              <div className="space-y-2">
                <div className={`w-12 h-12 rounded-full transition-all duration-300 ${
                  gameState === 'red' 
                    ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' 
                    : 'bg-red-900/30 border border-red-800/50 '
                }`}></div>
                <div className={`w-12 h-12 rounded-full transition-all duration-300 ${
                  gameState === 'green' 
                    ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse' 
                    : 'bg-emerald-900/30 border border-emerald-800/50'
                }`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-10">
          <div className={`text-3xl font-bold mb-0 transition-colors duration-300 ${
            gameState === 'green' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {gameState === 'green' ? 'GREEN LIGHT' : 'RED LIGHT'}
          </div>
          <div className="text-slate-400 text-lg">
            {gameState === 'green' ? 'GO!' : 'STOP!'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mb-4">
          <div className="relative h-4 bg-slate-700 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 rounded-full to-emerald-300 transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
            
            {/* Runner Image */}
            <div 
              className="absolute top-1/2 transform -translate-y-6 -translate-x-2 transition-all duration-300 z-10"
              style={{ left: `calc(${progress}% - 16px)`, transform: `translateY(-50%)` }}
            >
              <img 
                src="/assets/player.png"
                alt="player"
                className="w-16 h-16"
                style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }}
              />
            </div>
          </div>
           <div className="flex justify-between text-sm text-slate-400 mt-1">
            <span>Start</span>
            <span>{Math.round(progress)}%</span>
            <span>Finish</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            disabled={gameOver}
            className={`relative w-40 h-40 rounded-full border-4 transition-all duration-300 select-none ${
              isHolding 
                ? 'bg-emerald-500/20 border-emerald-400 scale-95 shadow-lg shadow-emerald-500/30' 
                : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
            } ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="mb-2"><Hand size={50}/></div>
              <div className="text-lg font-semibold">TAP & HOLD</div>
              <div className="text-sm text-slate-400">TO MOVE</div>
            </div>
            
            {isHolding && !gameOver && (
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-75"></div>
            )}
          </button>
          
          <div className="mt-6 text-slate-400 text-center max-w-sm text-xs">
            Hold the button when light is GREEN. Release immediately when RED!
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#1F2A38] border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="flex justify-center mb-4">
              <AlertTriangle size={48} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">GAME OVER</h2>
            <p className="text-slate-300 mb-6">You moved during RED LIGHT! Better luck next time.</p>
            <Link 
              href="/leaderboard" 
              className="block bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#1A212D] font-bold py-2 px-4 rounded-lg hover:from-emerald-300 hover:to-emerald-400 transition"
            >
              View Leaderboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
