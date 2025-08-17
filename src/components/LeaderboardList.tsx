import React from 'react'
import { Trophy, Medal, Award} from 'lucide-react';

const LeaderboardList = () => {
      const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-gray-400 font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankBg = (rank) => {
    switch(rank) {
      case 1: return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30";
      case 2: return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30";
      case 3: return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30";
      default: return "bg-slate-800/50 border-slate-700/50";
    }
  };
      const leaderboardData = [
    { rank: 1, name: "Mandeep", score: 2847, time: "2:34", avatar: "👨‍💻" },
    { rank: 2, name: "Sarah", score: 2691, time: "2:41", avatar: "👩‍🎨" },
    { rank: 3, name: "Alex", score: 2523, time: "2:58", avatar: "🧑‍🚀" },
    { rank: 4, name: "Jordan", score: 2398, time: "3:12", avatar: "👨‍🎓" },
    { rank: 5, name: "Casey", score: 2256, time: "3:27", avatar: "👩‍💼" },
    { rank: 6, name: "Morgan", score: 2134, time: "3:45", avatar: "🧑‍🔬" },
    { rank: 7, name: "Riley", score: 2087, time: "4:02", avatar: "👨‍🍳" },
    { rank: 8, name: "Taylor", score: 1943, time: "4:18", avatar: "👩‍⚕️" },
    { rank: 9, name: "Jamie", score: 1876, time: "4:33", avatar: "🧑‍🎤" },
    { rank: 10, name: "Quinn", score: 1754, time: "4:47", avatar: "👨‍🎨" }
  ];
  return (
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <div className="space-y-3">
          {leaderboardData.map((player) => (
            <div 
              key={player.rank}
              className={`
                flex items-center p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg
                ${getRankBg(player.rank)}
              `}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-12 h-12 mr-4">
                {getRankIcon(player.rank)}
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <div className="font-semibold text-lg">{player.name}</div>
                <div className="text-sm text-gray-400">Rank #{player.rank}</div>
              </div>

              {/* Stats */}
              <div className="text-right mr-6">
                <div className="text-xl font-bold text-emerald-400">
                  {player.score.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">points</div>
              </div>

              <div className="text-right">
                <div className="text-lg font-semibold text-emerald-300">
                  {player.time}
                </div>
                <div className="text-sm text-gray-400">time</div>
              </div>
            </div>
          ))}
        </div>

      </div>  
  )
}

export default LeaderboardList