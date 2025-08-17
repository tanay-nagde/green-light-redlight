"use client";
import React, { useState } from 'react';
import Link from "next/link";

const Admin = () => {
  const [enteredId, setEnteredId] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Your admin panel states (hooks must always be called, even if not used yet)
  const [sessionName, setSessionName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sessions, setSessions] = useState([
    { id: 'RLGL001', name: 'Championship Round', createdAt: '2024-08-14T10:30:00Z', players: 12, status: 'active' },
    { id: 'RLGL002', name: 'Beginner Practice', createdAt: '2024-08-14T09:15:00Z', players: 8, status: 'waiting' },
    { id: 'RLGL003', name: 'Tournament Final', createdAt: '2024-08-14T08:45:00Z', players: 24, status: 'completed' }
  ]);

  const SECRET_ADMIN_ID = "2005";

  const handleAccess = () => {
    if (enteredId === SECRET_ADMIN_ID) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect Admin ID!");
    }
  };

  const generateSessionId = () => {
    return 'RLGL' + String(Math.floor(Math.random() * 9000) + 1000);
  };

  const createSession = () => {
    if (sessionName.trim()) {
      const newSession = {
        id: generateSessionId(),
        name: sessionName.trim(),
        createdAt: new Date().toISOString(),
        players: 0,
        status: 'waiting'
      };
      setSessions([newSession, ...sessions]);
      setSessionName('');
    }
  };

  const deleteSession = (sessionId) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'waiting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Render login screen if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg space-y-4 max-w-sm w-full">
          <h1 className="text-2xl font-bold text-white text-center">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter Admin ID"
            value={enteredId}
            onChange={(e) => setEnteredId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAccess}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  // Render actual admin panel
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-400">Manage Red Light Green Light Sessions</p>
        </div>

        {/* Create Session */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-white mb-4">Create New Session</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter session name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={createSession}
              disabled={!sessionName.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg"
            >
              Create Session
            </button>
          </div>
        </div>

        {/* Search + List */}
        <div className="bg-gray-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">All Sessions</h2>
            <div className="text-sm text-gray-400">
              {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by session name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No sessions found</div>
            ) : (
              filteredSessions.map((session) => (
                <div key={session.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{session.name}</h3>
                    <div className="text-sm text-gray-400">
                      {session.id} • {session.players} players • {formatDate(session.createdAt)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/${session.id}`} className="bg-green-600 px-4 py-2 rounded-lg text-white">
                      View
                    </Link>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="bg-red-600 px-4 py-2 rounded-lg text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
