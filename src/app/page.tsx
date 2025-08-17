"use client"
import Link from 'next/link';
import React, { useState } from 'react';

const Home = () => {
  const [sessionId, setSessionId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleJoinGame = () => {
    if (sessionId.trim() && playerName.trim()) {
      console.log('Joining game:', { sessionId, playerName });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center ">
          <h1 className="text-[2.8rem] font-bold text-white tracking-tight leading-none">
            RED LIGHT
          </h1>
          <h2 className="text-[2.8rem] font-bold text-white tracking-tight leading-none">
            GREEN LIGHT
          </h2>
        </div>
      
        <div className="flex justify-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-red-400 rounded-full shadow-red-500/50 shadow-2xl animate-pulse"></div>
            <div className="absolute inset-0 w-8 h-8 bg-red-400 blur rounded-full animate-ping opacity-90"></div>
          </div>
          <div className="relative">
            <div className="w-8 h-8 bg-green-400 rounded-full shadow-green-500/50 shadow-2xl animate-pulse"></div>
            <div className="absolute inset-0 w-8 h-8 bg-green-400 blur rounded-full animate-ping opacity-90"></div>
          </div>
        </div>

        <div className="bg-[#1F2A38] rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-semibold text-white text-center">
            How to Play
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">GREEN: Tap and hold to move forward</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">RED: Stop immediately or lose!</span>
            </div>
          </div>
          <p className="text-gray-400 text-center text-sm">
            Reach the finish line fastest
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Session ID"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200 transition-colors"
          />
          <input
            type="text"
            placeholder="Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200 transition-colors"
          />
        </div>

        <div className="mx-auto flex items-center justify-center">
          <Link href={`/${sessionId}`}
          className="w-full text-center bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-101 disabled:hover:scale-100 cursor-pointer"
          onClick={handleJoinGame}
          disabled={!sessionId.trim() || !playerName.trim()}
        >
          JOIN GAME
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;