import React from 'react';
import { Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import LeaderboardList from '@/components/LeaderboardList';
import Stats from '@/components/Stats';

const Page = () => {


  return (
    <div className="min-h-screen bg-[#1A212D] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700/50">
        <Link href={"/"} className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors">
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
          <span>127 online</span>
        </div>
      </div>

      {/* Stats Summary */}
      <Stats/>
    

      {/* Leaderboard List */}
      <LeaderboardList />

      {/* Your Rank */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1F2A38]/50 backdrop-blur-sm border-t border-slate-700/50 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="font-semibold">Your Rank</div>
              <div className="text-sm text-gray-400">#1 - Mandeep</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-400">2,847 pts</div>
            <div className="text-sm text-gray-400">Best: 2:34</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;