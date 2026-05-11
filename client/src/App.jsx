import React from 'react'
import { Routes, Route } from "react-router-dom"
import  Home  from "../src/pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Notes from "./pages/Notes.jsx"
import Quiz from "./pages/Quiz.jsx"
import Tutor from "./pages/Tutor.jsx"
import StudyRoom from "./pages/StudyRoom.jsx"
import RoomChat from './pages/RoomChat.jsx'
import ImageAnalysis from './pages/ImageAnalysis.jsx'
import PDFSummary from './pages/PDFSummary.jsx'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/dashboard' element={<ProtectedRoute component={<Dashboard/>}/>} />
        <Route path='/notes' element={<ProtectedRoute component={<Notes />} />} />
        <Route path='/quiz' element={<ProtectedRoute component={<Quiz />} />} />
        <Route path='/tutor' element={<ProtectedRoute component={<Tutor />} />} />
        <Route path='/study-room' element={<ProtectedRoute component={<StudyRoom />} />} />
        <Route path='/study-room/:roomId' element={<ProtectedRoute component={<RoomChat/>} />} />
        <Route path='/image-analysis' element={<ProtectedRoute component={<ImageAnalysis />} />} />
        <Route path='/pdf-analysis' element={<ProtectedRoute component={<PDFSummary />} />} />

      </Routes>
    </>
  )
}

export default App
