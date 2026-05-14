import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveSessions, joinSession } from '../api/api';
import Navbar from '../components/Navbar';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  function loadSessions() {
    setLoading(true);
    getActiveSessions()
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }

  async function handleJoinByCode(e) {
    e.preventDefault();
    const code = joinCode.trim();
    if (!code) return;

    setError('');
    try {
      await joinSession(code);
      navigate('/session/' + code);
    } catch (err) {
      setError(err.message || 'Failed to join session');
    }
  }

  async function handleJoin(roomId) {
    setError('');
    try {
      await joinSession(roomId);
      navigate('/session/' + roomId);
    } catch (err) {
      setError(err.message || 'Failed to join session');
    }
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />

      <main className="max-w-200 mx-auto px-4 py-8">
        <h1 className="text-white text-[28px] font-bold mb-6">Watch Together</h1>

        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-8">
          <h2 className="text-white text-lg font-bold mb-4">Join a session</h2>
          <form onSubmit={handleJoinByCode} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter room code..."
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 px-4 py-3 bg-[#333] border border-transparent rounded text-white text-base outline-none focus:border-[#e50914] placeholder-[#8c8c8c]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#e50914] hover:bg-[#f40612] rounded text-white text-sm font-bold cursor-pointer whitespace-nowrap"
            >
              Join
            </button>
          </form>
          {error && <p className="text-[#e87c03] text-sm mt-3">{error}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-bold">Active sessions</h2>
            <button
              onClick={loadSessions}
              className="text-[#e5e5e5] hover:text-white text-sm cursor-pointer"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-[#737373] text-sm">Loading...</p>
          ) : sessions.length === 0 ? (
            <p className="text-[#737373] text-sm">No active sessions. Start one from any video!</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.roomId} className="flex items-center justify-between bg-[#1a1a1a] rounded-lg p-4">
                  <div>
                    <p className="text-white font-bold">{s.mediaTitle}</p>
                    <p className="text-[#737373] text-sm mt-1">
                      Host: {s.hostDisplayName} &middot; Room: <span className="font-mono">{s.roomId}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoin(s.roomId)}
                    className="px-4 py-2 bg-[#e50914] hover:bg-[#f40612] rounded text-white text-sm font-bold cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
