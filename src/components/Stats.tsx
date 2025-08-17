import React from 'react'

const Stats = () => {
  return (
      <div className="grid grid-cols-3 gap-4 p-6 max-w-4xl mx-auto">
        <div className="bg-[#1F2A38] rounded-xl p-4 text-center border border-slate-700/50">
          <div className="text-2xl font-bold text-emerald-400">127</div>
          <div className="text-sm text-gray-400">Active Players</div>
        </div>
        <div className="bg-[#1F2A38] rounded-xl p-4 text-center border border-slate-700/50">
          <div className="text-2xl font-bold text-emerald-400">2,847</div>
          <div className="text-sm text-gray-400">Best Score</div>
        </div>
        <div className="bg-[#1F2A38] rounded-xl p-4 text-center border border-slate-700/50">
          <div className="text-2xl font-bold text-emerald-400">2:34</div>
          <div className="text-sm text-gray-400">Best Time</div>
        </div>
      </div>
  )
}

export default Stats