"use client"
import LeaderboardList from '@/components/LeaderboardList';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const SessionDetail = ({ params }) => {
  const [sessionData, setSessionData] = useState({
    name: 'hello',
    id: 'cb431923-6a15-4401-af02-e014b00935e9',
    status: 'WAITING',
    playersConnected: 0,
    gameStarted: false
  });

  const [players, setPlayers] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && sessionData.playersConnected < 12) {
        setSessionData(prev => ({
          ...prev,
          playersConnected: prev.playersConnected + 1
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionData.playersConnected]);

  const startGame = () => {
    setSessionData(prev => ({
      ...prev,
      status: 'ACTIVE',
      gameStarted: true
    }));
  };

  const endGame = () => {
    setSessionData(prev => ({
      ...prev,
      status: 'ENDED',
      gameStarted: false
    }));
    setPlayers([
      { name: 'Alex', score: 2500, position: 1 },
      { name: 'Sarah', score: 2350, position: 2 },
      { name: 'Mike', score: 2100, position: 3 },
      { name: 'Emma', score: 1950, position: 4 },
      { name: 'James', score: 1800, position: 5 }
    ]);
  };

  const QRCodePlaceholder = () => (
    <div className="w-32 h-32 bg-white rounded-lg p-3 flex items-center justify-center">
      <div className="w-full h-full bg-black rounded grid grid-cols-10 gap-px">
        {[...Array(100)].map((_, i) => (
          <div 
            key={i} 
            className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-black'}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            Red Light Green Light - Admin Panel
          </h1>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Session Control */}
          <div className="bg-[#1F2A38] rounded-lg p-5 border border-slate-700">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-normal text-slate-400">Session Control</h2>
              <Link href={"/admin"} className="bg-slate-600 hover:bg-slate-500 text-slate-200 px-3 py-1.5 rounded-full text-xs font-normal border border-slate-500 flex items-center gap-2">
                <div className="w-3 h-3 border border-slate-400 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                </div>
                New Session
              </Link>
            </div>

            {/* Session Name */}
            <div className="mb-5">
              <h3 className="text-2xl font-normal text-yellow-400 mb-2">{sessionData.name}</h3>
              <p className="text-slate-400 text-xs">Session ID: {sessionData.id}</p>
            </div>

            {/* Players Connected */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4">
                <svg className="w-full h-full text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span className="text-teal-400 font-normal text-sm">
                {sessionData.playersConnected} players connected
              </span>
            </div>

            {/* Control Buttons */}
            <div className="space-y-2 mb-6">
              <button
                onClick={startGame}
                disabled={sessionData.status === 'ACTIVE' || sessionData.playersConnected === 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-normal py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Start Game
              </button>
              
              <button
                onClick={endGame}
                disabled={sessionData.status !== 'ACTIVE'}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-normal py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z"/>
                </svg>
                End Game
              </button>
            </div>

            {/* Status */}
            <div className="text-center">
              <p className="text-slate-400 text-xs mb-2">Status:</p>
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500 text-white font-normal text-xs">
                {sessionData.status}
              </span>
            </div>
          </div>

          {/* Player QR Code */}
          <div className="bg-[#1F2A38] rounded-lg p-5 border border-slate-700">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-5">
                <svg className="w-full h-full text-teal-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
                  <path d="M18 13h-2v2h2v-2zM20 15h-2v2h2v-2zM16 15h-2v2h2v-2zM18 17h-2v2h2v-2zM20 19h-2v2h2v-2z"/>
                </svg>
              </div>
              <h2 className="text-lg font-normal text-slate-400">Player QR Code</h2>
            </div>
            <div className="text-center">
              <div className="inline-block mb-3">
                <QRCodePlaceholder />
              </div>
              <p className="text-slate-400 text-xs max-w-xs mx-auto">
                Players can scan this QR code to join:
              </p>
            </div>
          </div>
        </div>

        {/* Live Leaderboard */}
        <div className="bg-[#1F2A38] rounded-lg p-5 border border-slate-700">
          <h2 className="text-lg font-normal text-slate-400 mb-5">Live Leaderboard</h2>
          
          <LeaderboardList/>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;