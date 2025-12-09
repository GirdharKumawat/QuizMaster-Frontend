import { Card, Button } from "../components/ui";
import { Plus, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../features/quiz/useQuiz";
import { useAuth } from "../features/auth/useAuth";
import { use, useEffect } from "react";
import { toast } from "sonner";
const HomePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const { quizState, getCretedQuizzes, getEnrolledQuizzes } = useQuiz();
  const { fetchUser, authState, loginUser } = useAuth();

  const quizzesRaw = quizState.createdQuizzes;
  const enrolledQuizzesRaw = quizState.enrolledQuizzes;
 
  const quizzes = quizzesRaw||[];
  const enrolledQuizzes = enrolledQuizzesRaw||[];
  const { id, username } = authState;
  useEffect(() => {
    if (!quizzes.length && quizState.canTry) {
      getCretedQuizzes();
    }

    if(!enrolledQuizzes.length && quizState.canTry){
      getEnrolledQuizzes();
    }

    if (!id || !username) {
      fetchUser(id);
    }
    
  }, [quizzes]);

  
  // fn();
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {username}!
              </h1>
              <p className="text-gray-600">
                Ready for your next quiz challenge?
              </p>

             

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

        {/* User's Created Quizzes */}
        <Card className="mb-8 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Quizzes
          </h3>
          {quizzes && quizzes.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {quizzes.map((quiz) => {
                // support nested `quizze` (seed.js sample) and alternate field names
                const q = quiz;
                const id = q._id;
                const title = q.title||"Untitled Quiz";
                const description = q.description ;
                const questionCount = q.questionCount;
                return (
                  <div
                    onClick={() => navigate(`/waiting/${id}`)}
                    key={id}
                    className="p-4 border rounded-lg bg-white flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">{title}</h4>
                      <p className="text-sm text-gray-500">{description || `${questionCount} questions`}</p>
                    </div>
                    <div className="flex space-x-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500">
              You haven't created any quizzes yet. Create your first quiz to see
              it here.
            </div>
          )}
        </Card>
        <Card className="mb-8 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Enrolled Quizzes
          </h3>
          {enrolledQuizzes && enrolledQuizzes.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {enrolledQuizzes.map((quiz) => {
                // support nested `quizze` (seed.js sample) and alternate field names
                const q = quiz;
                const id = q._id;
                const title = q.title||"Untitled Quiz";
                const description = q.description ;
                const questionCount = q.questionCount;
                return (
                  <div
                    onClick={() => navigate(`/waiting/${id}`)}
                    key={id}
                    className="p-4 border rounded-lg bg-white flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">{title}</h4>
                      <p className="text-sm text-gray-500">{description || `${questionCount} questions`}</p>
                    </div>
                    <div className="flex space-x-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500">
              You haven't created any quizzes yet. Create your first quiz to see
              it here.
            </div>
          )}
        </Card>

        {/* User's Enrolled Quizzes */}

       
                

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card
            className="p-8 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
            onClick={() => navigate("/create")}
          >
            <div className="w-20 h-20 bg-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sm">
              <Plus className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Create Quiz Room
            </h2>
            <p className="text-gray-600 mb-6">
              Set up a new quiz session and invite friends to join
            </p>
            <Button variant="primary" className="w-full">
              Get Started
            </Button>
          </Card>

          <Card
            className="p-8 text-center hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
            onClick={() => navigate("/join")}
          >
            <div className="w-20 h-20 bg-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sm">
              <Users className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Join Quiz Room
            </h2>
            <p className="text-gray-600 mb-6">
              Enter a room code and compete with other players
            </p>
            <Button
              onClick={() => {
                navigate("/join");
              }}
              variant="secondary"
              className="w-full"
            >
              Join Now
            </Button>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activity
          </h3>
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
