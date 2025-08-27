import React, { useState } from 'react';
import { Users, User, Hash, Home } from 'lucide-react';
import {Card,Button,Input } from '../components/ui';
import { useNavigate } from 'react-router-dom';

const JoinRoomPage = ({onNavigate }) => {
  const [roomCode, setRoomCode] = useState('');
  const user = { name: 'Guest',id:'1' }; // Mock user - in real app, this would come from auth context or props    

  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

    const navigate=useNavigate();
  // Mock room details - in real app, this would come from API
  const [roomDetails] = useState({
    host_id: '12',
    name: 'Geography Quiz',
    duration: 30,
    questions: 15,
    participants: ['Alice', 'Bob', 'Charlie', 'David']
  });

  // Glass card component
 

  const handleJoin = async () => {
    if ( !roomCode.trim()) {
      alert('Please fill in both name and room code');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setJoined(true);
      // In real app: onJoinRoom(joinData);
    }, 1500);
  };

  const handleStartQuiz = () => {
    onNavigate('quiz');
  };

  // Waiting Room View
  if (joined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setJoined(false)}
              className="mr-4 text-gray-600 hover:text-purple-600 p-2 rounded-lg hover:bg-white/20 transition-all"
            >
              <Home size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Waiting Room</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Room Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Room Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/20 rounded-xl">
                  <span className="text-gray-600">Room Name:</span>
                  <span className="font-medium text-gray-800">{roomDetails.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/20 rounded-xl">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-800">{roomDetails.duration} minutes</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/20 rounded-xl">
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-medium text-gray-800">{roomDetails.questions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/20 rounded-xl">
                  <span className="text-gray-600">You:</span>
                  <span className="font-medium text-purple-800">{user.name}</span>
                </div>
              </div>
            </Card>

            {/* Participants */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Participants ({roomDetails.participants.length + 1})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {/* Current user */}
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-100 to-teal-100 border-2 border-purple-300 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full flex items-center justify-center mr-3">
                    <User className="text-white" size={16} />
                  </div>
                  <span className="text-purple-800 font-medium">{user.name} (You)</span>
                </div>
                
                {/* Other participants */}
                {roomDetails.participants.map((participant, index) => (
                  <div key={index} className="flex items-center p-3 bg-white/20 rounded-xl border border-purple-400">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mr-3">
                      <User className="text-white" size={16} />
                    </div>
                    <span className="text-gray-800">{participant}</span>
                   
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Status Section */}
          <Card className="mt-8 p-6 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Waiting for Host</h3>
              <p className="text-gray-600 mb-4">The quiz will start once the host begins the session</p>
            </div>
            
            {/* Mock start button for demo */}
            <div className="flex justify-center gap-4">
              <Button variant="secondary" onClick={() => setJoined(false)}>
                Leave Room
              </Button>
              
                
            { roomDetails.host_id===user.id &&  <Button onClick={handleStartQuiz}>
                Start Quiz (Demo)
              </Button>}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Join Form View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Join Quiz Room</h1>
          <p className="text-gray-600">Enter the room details to participate</p>
        </div>

        <div className="space-y-4 mb-6">
            
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Room Code</label>
            <Input
              icon={Hash}
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode( e.target.value.toUpperCase())}
            />
          </div>
        </div>

        <Button 
          onClick={handleJoin} 
          className="w-full mb-4"
          disabled={loading || !roomCode.trim()}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Joining...
            </div>
          ) : (
            'Join Room'
          )}
        </Button>

        <div className="text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-purple-600 font-medium hover:underline transition-colors"
          >
            Back to Home
          </button>
        </div>

        {/* Help Section */}
        <Card className="mt-6 p-4 bg-blue-50/30">
          <h4 className="font-medium text-gray-800 mb-2">Need help?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Ask the host for the room code</li>
            <li>• Make sure you enter your real name</li>
            <li>• Room codes are case-insensitive</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
};

export default JoinRoomPage;