import React, { useState } from 'react';
import { Users, Hash, ArrowRight, Home } from 'lucide-react';
import { Card, Button, Input } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../features/quiz/useQuiz';

// Presentational + light validation Join Room page
// Navigates to /waiting-room with state when join succeeds.
function RoomJoinPage() {
  const navigate = useNavigate();
  const { joinQuiz,getEnrolledQuizzes } = useQuiz();
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const normalized = roomCode.trim();
  const isValidCode = true
  const handleJoin = async (e) => {
    e?.preventDefault();
    setError('');
    if (!normalized) {
      setError('Room code required');
      return;
    }
    
    setLoading(true);
    // Simulated API delay
    const result = await joinQuiz(normalized);
    if(result ){
    setLoading(false);
    await getEnrolledQuizzes();
    navigate(`/waiting/${normalized}`);
    } else {
      setLoading(false);
      setError('Failed to join room. Please check the code and try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.18),transparent_60%)]" />
      <Card className="relative w-full max-w-md p-8 space-y-7 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-md ring-4 ring-white/60">
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Join a Room</h1>
            <p className="text-sm text-gray-500">Enter the code shared by the host to join the lobby.</p>
          </div>
        </div>

        <form onSubmit={handleJoin} className="space-y-5">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">Room Code</label>
            <Input
              icon={Hash}
              id="roomCode"
              placeholder="QUIZ123"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value)}
              className={` font-mono italic ${error ? 'border-red-300 focus:ring-red-400' : ''}`}
            />
             
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading || !isValidCode}
            className="w-full flex items-center justify-center gap-2 py-3 font-semibold"
          >
            {loading && <span className="animate-spin h-4 w-4 rounded-full border-2 border-white/40 border-t-white" />}
            {loading ? 'Joining...' : 'Join Room'}
            {!loading && <ArrowRight size={16} />}
          </Button>
        </form>

        <div className="text-center text-sm">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 font-medium transition-colors inline-flex items-center gap-1"
          >
            <Home size={14}/> Home
          </button>
        </div>

        <Card variant="subtle" className="p-4 text-xs space-y-2 bg-white/60">
          <p className="font-semibold text-gray-700">Tips</p>
          <ul className="space-y-1 text-gray-600 list-disc ml-4">
            <li>Ask the host for the active room code.</li>
            <li>Keep this window open after joining.</li>
            <li>Code isn’t case sensitive; we auto-format.</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
}

export default RoomJoinPage;