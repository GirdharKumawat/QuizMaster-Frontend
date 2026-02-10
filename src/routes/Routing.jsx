import SigninPage from '../pages/Signin'
import SignupPage from '../pages/Signup'
import WaitingRoomPage from '../pages/WaitingRoom'
import QuizPage from '../pages/QuizPage'
import LeaderBordPage from '../pages/LeaderBord'
import LandingPage from '../pages/Landing'
import NotFoundPage from '../pages/NotFound'
import ScorePage from '../pages/ScorePage'
import ProtectedRoute from './ProtectedRoute'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from '../pages/HomePage';
 

function Routing() {
  return (
    <BrowserRouter>
                <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/home' element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
                    <Route path='/waiting/:session_id' element={<ProtectedRoute><WaitingRoomPage /></ProtectedRoute>} />
                    <Route path='/quiz/:session_id' element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                    <Route path='/quiz' element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                    <Route path='/leaderboard/:session_id' element={<ProtectedRoute><LeaderBordPage /></ProtectedRoute>} />
                    <Route path='/score' element={<ProtectedRoute><ScorePage /></ProtectedRoute>} />

                    <Route path='/login' element={<SigninPage />} />
                    <Route path='/signup' element={<SignupPage />} />
                    <Route path='/404' element={<NotFoundPage />} />
                    <Route path='*' element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
  )
}

export default Routing

