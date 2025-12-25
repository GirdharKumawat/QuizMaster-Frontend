import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, LogOut } from "lucide-react";
import { Card, Button } from "../components/ui";
import { useQuiz } from "../features/quiz/useQuiz";
import { useAuth } from "../features/auth/useAuth";

const HomePage = () => {
  const navigate = useNavigate();
  
  // Custom Hooks - Logic Layer
  const { quizState, getCreatedQuizzes, getEnrolledQuizzes } = useQuiz();
  const { authState, fetchUser, logoutUser } = useAuth();

  const { username } = authState;
  const { createdQuizzes, enrolledQuizzes } = quizState;

  useEffect(() => {
    if (!username) {
        fetchUser();
    }
    getCreatedQuizzes();
    getEnrolledQuizzes();
    
  }, []); 

  const handleLogout = () => {
      logoutUser();
      navigate("/login");};

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <Card className="p-6 mb-8 bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {username || "Player"}!
              </h1>
              <p className="text-gray-600 mt-1">
                Ready for your next quiz challenge?
              </p> 
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
              title="Logout"
            >
              <LogOut size={24} />
            </button>
          </div>
        </Card>

        {/* Section 1: Created Quizzes */}
        <Card className="mb-8 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-purple-600 rounded-full mr-2"></span>{}
            Your Created Quizzes
          </h3>
          
          {createdQuizzes && createdQuizzes.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {createdQuizzes.map((quiz) => (
                <button
                  key={quiz.quiz_id}
                  onClick={() => navigate(`/waiting/${quiz.quiz_id}`)}
                  className="p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md hover:border-purple-200 cursor-pointer transition-all group text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                            {quiz.title || "Untitled Quiz"}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                            {quiz.description || `${quiz.question_count} questions`}
                        </p>
                    </div>
                    {/* Optional: Add status badge here */}
                  </div>
                </button>
              ))}
            </div>

          ) : (
            <div className="text-gray-400 italic py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
              You haven't created any quizzes yet.
            </div>
          )}
        </Card>

        {/* Section 2: Enrolled Quizzes */}
        <Card className="mb-8 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-teal-500 rounded-full mr-2"></span>{}
            Enrolled Quizzes
          </h3>

          {enrolledQuizzes && enrolledQuizzes.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {enrolledQuizzes.map((quiz) => (
                <button
                  key={quiz.quiz_id}
                  onClick={() => navigate(`/waiting/${quiz.quiz_id}`)}
                  className="p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md hover:border-teal-200 cursor-pointer transition-all group text-left"
                >
                   <h4 className="font-semibold text-gray-800 group-hover:text-teal-700 transition-colors">
                        {quiz.title || "Untitled Quiz"}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {quiz.description || 0}{quiz.question_count || 0} Questions • {quiz.status || "Joined"}
                    </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 italic py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
              You haven't joined any quizzes yet.
            </div>
          )}
        </Card>

        {/* Section 3: Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Card */}
          <Card
            as="button"
            className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group border-0 ring-1 ring-gray-100"
            onClick={() => navigate("/create")}
            onKeyDown={(e) => e.key === 'Enter' && navigate("/create")}
            role="button"
            tabIndex={0}
          >
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl mx-auto mb-5 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
              <Plus size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Create Quiz Room</h2>
            <p className="text-gray-500 mb-6 text-sm">Set up a new session and be the host</p>
            <Button variant="primary" className="w-full">Create Now</Button>
          </Card>

          {/* Join Card */}
          <Card
            as="button"
            className="p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group border-0 ring-1 ring-gray-100"
            onClick={() => navigate("/join")}
            onKeyDown={(e) => e.key === 'Enter' && navigate("/join")}
            role="button"
            tabIndex={0}
          >
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl mx-auto mb-5 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
              <Users size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Join Quiz Room</h2>
            <p className="text-gray-500 mb-6 text-sm">Enter a code to join a friend's game</p>
            <Button variant="secondary" className="w-full">Join Game</Button>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default HomePage;