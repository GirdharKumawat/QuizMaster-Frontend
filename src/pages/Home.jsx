import {Card,Button } from '../components/ui';
import { Plus, Users, LogOut } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
const HomePage = ({ user, onLogout }) => {
    const navigate=useNavigate();
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
              <p className="text-gray-600">Ready for your next quiz challenge?</p>
            </div>
            <button 
              onClick={onLogout}
              className="text-gray-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-white/20"
              title="Logout"
            >
              <LogOut size={24} />
            </button>
          </div>
        </Card>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 text-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/create-room')}>
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Plus className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Create Quiz Room</h2>
            <p className="text-gray-600 mb-6">Set up a new quiz session and invite friends to join</p>
            <Button variant="primary" className="w-full">Get Started</Button>
          </Card>

          <Card className="p-8 text-center hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/join-room')}>
            <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Users className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Join Quiz Room</h2>
            <p className="text-gray-600 mb-6">Enter a room code and compete with other players</p>
            <Button onClick={()=>{navigate('/join-room')}} variant="secondary" className="w-full">Join Now</Button>
          </Card>
        </div>
 
        {/* Recent Activity Section */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="text-center text-gray-500 py-8">
            <p>No recent quiz activity</p>
            <p className="text-sm">Start by creating or joining a quiz room!</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;