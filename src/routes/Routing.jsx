import SigninPage from '../pages/Signin'
import SignupPage from '../pages/Signup'
import RoomJoinPage from '../pages/RoomJoin'
import CreateRoomPage from '../pages/CreateRoom'

import { BrowserRouter, Routes, Route } from "react-router-dom";

import React from 'react'
import HomePage from '../pages/Home';

function Routing() {
  return (
    <>
      <BrowserRouter>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/create-room' element={<CreateRoomPage />} />
                    <Route path='/join-room' element={<RoomJoinPage />} />

                    <Route path='/login' element={<SigninPage />} />
                    <Route path='/signup' element={<SignupPage />} />
                </Routes>
            </BrowserRouter>
    </>
  )
}

export default Routing