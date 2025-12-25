import React, { useState } from 'react';
import { Users, Hash, ArrowRight, Home, Loader2 } from 'lucide-react';
import { Card, Button, Input } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../features/quiz/useQuiz';

function RoomJoinPage() {
  const navigate = useNavigate();
  const { joinQuiz } = useQuiz(); // No need for getEnrolledQuizzes here
  
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const normalized = roomCode.trim();
  const isValidCode = normalized.length > 0; // Simple validation

  const handleJoin = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!isValidCode) {
      setError('Room code required');
      return;
    }
    
    setLoading(true);
    
    // 1. Call the API (Logic is inside useQuiz hook)
    const result = await joinQuiz(normalized);
    
    // 2. Handle Success
    if (result) {
        // useQuiz already updated Redux. We just navigate.
        // We use result._id (or result.id) to be safe, though usually code == id
        const targetId = result._id || result.id || normalized;
        navigate(`/waiting/${targetId}`);
    } else {
        // useQuiz handles the toast error, we just stop loading here
        setLoading(false);
        // Optional: Set local error state if you want text below input
        setError('Failed to join. Check code or try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.18),transparent_60%)]" />
      
      <Card className="relative w-full max-w-md p-8 space-y-7 animate-fade-in shadow-xl shadow-indigo-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-200 ring-4 ring-white/60">
            <Users className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Join a Room</h1>
            <p className="text-sm text-gray-500 mt-2">Enter the code shared by the host.</p>
          </div>
        </div>

        <form onSubmit={handleJoin} className="space-y-5">
          <div>
            <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-1">
                Room Code / ID
            </label>
            <Input
              icon={Hash}
              id="roomCode"
              placeholder="e.g. 64f2a..."
              value={roomCode}
              onChange={e => {
                  setRoomCode(e.target.value);
                  setError(''); // Clear error on type
              }}
              className={`font-mono text-center tracking-wider ${error ? 'border-red-300 focus:ring-red-400' : ''}`}
              autoComplete="off"
            />
            {error && <p className="text-xs text-red-500 mt-2 ml-1 animate-pulse">{error}</p>}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading || !isValidCode}
            className="w-full flex items-center justify-center gap-2 py-3 font-semibold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all"
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={18} />
                    Joining...
                </>
            ) : (
                <>
                    Join Room
                    <ArrowRight size={18} />
                </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm pt-2">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-purple-600 font-medium transition-colors inline-flex items-center gap-1 group"
          >
            <Home size={14} className="group-hover:-translate-x-0.5 transition-transform"/> 
            Back to Dashboard
          </button>
        </div>

        <Card variant="subtle" className="p-4 text-xs space-y-2 bg-purple-50/50 border-purple-100">
          <p className="font-semibold text-purple-800">Quick Tips</p>
          <ul className="space-y-1 text-purple-700/80 list-disc ml-4 leading-relaxed">
            <li>Paste the exact code shared by the host.</li>
            <li>Don't refresh the page while waiting in the lobby.</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
}

export default RoomJoinPage;