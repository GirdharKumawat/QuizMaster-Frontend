import React from 'react';
import { Card, Button } from '../components/ui';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Pure presentational Waiting Room UI.
 * Later you can inject real-time data by passing props or wrapping with a container.
 */
const demoParticipants = [
  { id: 1, name: 'Alice', status: 'ready', isHost: true },
  { id: 2, name: 'Bob', status: 'waiting' },
  { id: 3, name: 'Charlie', status: 'ready' },
];

const demoSettings = {
  title: 'Fun Quiz Room',
  code: 'QUIZ123',
  questionCount: 12,
  timePerQuestion: 20,
  autoStart: false,
};

function StatusBadge({ label, color = 'gray' }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
    gray: 'bg-gray-100 text-gray-700',
    purple: 'bg-purple-100 text-purple-700',
    yellow: 'bg-yellow-100 text-yellow-700'
  };
  return (
    <span className={`text-[10px] tracking-wide px-2 py-0.5 rounded-full font-medium ${colors[color] || colors.gray}`}>{label}</span>
  );
}

function WaitingRoomPage({
  isHost = true, // toggle to false to preview player view
  participants = demoParticipants,
  settings = demoSettings,
  status = 'waiting', // waiting | counting_down | active
  countdown = 8,
  onKick = () => {},
  
}) {
  const canStart = isHost && status === 'waiting' && participants.length > 0;
  const showCountdown = status === 'counting_down';
  const nevigate = useNavigate()
  const onStart = () => {
    nevigate("/quiz/QUIZ123")

  }
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex flex-col gap-6">
        {/* Header / Room Summary */}
        <Card className="p-5 md:p-7 bg-gradient-to-br from-white to-purple-50/60 backdrop-blur border border-purple-100/60 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                {settings.title}
                <StatusBadge label={status === 'waiting' ? 'LOBBY' : status === 'counting_down' ? 'COUNTDOWN' : 'ACTIVE'} color={status === 'active' ? 'green' : status === 'counting_down' ? 'orange' : 'purple'} />
              </h1>
              <div className="flex flex-wrap gap-2 text-xs md:text-sm text-gray-600">
                <span className="flex items-center gap-1 bg-white rounded-md px-2 py-1 shadow-sm border border-gray-200 font-mono">Code: {settings.code}</span>
                <span className="bg-white rounded-md px-2 py-1 shadow-sm border border-gray-200">{settings.questionCount} Questions</span>
                <span className="bg-white rounded-md px-2 py-1 shadow-sm border border-gray-200">{settings.timePerQuestion}s / Q</span>
                <span className="bg-white rounded-md px-2 py-1 shadow-sm border border-gray-200">{settings.autoStart ? 'Auto Start' : 'Manual Start'}</span>
                {showCountdown && (
                  <span className="bg-orange-100 text-orange-700 rounded-md px-2 py-1 font-medium shadow-sm border border-orange-200 animate-pulse">Starting in {countdown}s</span>
                )}
              </div>
            </div>
            {isHost && (
              <div className="flex items-center gap-3 self-start">
                <Button
                  variant="primary"
                  className="px-6"
                  disabled={!canStart}
                  onClick={onStart}
                  aria-disabled={!canStart}
                >
                  Start Quiz
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Players List */}
          <Card className="p-5 lg:col-span-2 bg-white/70 border border-gray-200/70 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Players <span className="text-gray-400 font-normal">({participants.length})</span></h2>
              <div className="flex gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> ready</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full"></span> waiting</span>
              </div>
            </div>
            <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              {participants.map(p => (
                <li
                  key={p.id}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200/80 bg-white/80 backdrop-blur-sm px-4 py-3 hover:border-purple-300 transition-colors"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{p.name}</span>
                      {p.isHost && <StatusBadge label="HOST" color="yellow" />}
                      <StatusBadge label={p.status === 'ready' ? 'READY' : 'WAITING'} color={p.status === 'ready' ? 'green' : 'orange'} />
                    </div>
                  </div>
                  {isHost && !p.isHost && (
                    <button
                      type="button"
                      onClick={() => onKick(p.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      aria-label={`Remove ${p.name}`}
                    >
                      <X size={16} />
                    </button>
                  )}
                </li>
              ))}
              {participants.length === 0 && (
                <li className="text-center text-gray-500 py-10 bg-white/60 rounded-xl border border-dashed border-gray-300">Waiting for players to join…</li>
              )}
            </ul>
          </Card>

          {/* Side Panel */}
          <div className="space-y-6">
            <Card className="p-5 bg-white/70 border border-gray-200/70 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Lobby Status</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {status === 'waiting' && <p>Waiting for host to start the game.</p>}
                {status === 'counting_down' && <p>Game starting in <span className="font-semibold text-gray-800">{countdown}s</span>.</p>}
                {status === 'active' && <p>The quiz has started.</p>}
                <p className="text-xs text-gray-400 pt-2 border-t">You will automatically enter the quiz when it starts.</p>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, white, transparent 60%)' }} />
              <div className="relative space-y-3">
                <h3 className="font-semibold tracking-wide text-sm uppercase opacity-80">Quick Tips</h3>
                <ul className="text-xs leading-relaxed space-y-1.5">
                  <li>Share the room code with friends to join.</li>
                  <li>Host can remove idle players anytime.</li>
                  <li>Everyone sees the first question at the same time.</li>
                  <li>Stay on this tab for best experience.</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoomPage;