import SigninPage from '../pages/Signin'
import SignupPage from '../pages/Signup'
import RoomJoinPage from '../pages/RoomJoin'
import CreateRoomPage from '../pages/CreateRoom'
import WaitingRoomPage from '../pages/WaitingRoom'
import QuizPage from '../pages/QuizPage'
import LeaderBordPage from '../pages/LeaderBord'
import ProtectedRoute from './ProtectedRoute'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from '../pages/HomePage';
 

function Routing() {
  return (
    <BrowserRouter>
                <Routes>
                    <Route path='/' element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
                    <Route path='/join' element={<ProtectedRoute><RoomJoinPage /></ProtectedRoute>} />
                    <Route path='/create' element={<ProtectedRoute><CreateRoomPage /></ProtectedRoute>} />
                    <Route path='/waiting/:quizid' element={<ProtectedRoute><WaitingRoomPage /></ProtectedRoute>} />
                    <Route path='/quiz/:quizid' element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                    <Route path='/leaderboard/:quizid' element={<ProtectedRoute><LeaderBordPage /></ProtectedRoute>} />

                    <Route path='/login' element={<SigninPage />} />
                    <Route path='/signup' element={<SignupPage />} />
                </Routes>
            </BrowserRouter>
  )
}

export default Routing

