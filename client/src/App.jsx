import React from 'react'
import { Routes, Route } from "react-router-dom"
import  Home  from "../src/pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import ProtectedRoute from './components/ProtectedRoute.jsx'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/dashboard' element={<ProtectedRoute component={<Dashboard/>}/>} />
      </Routes>
    </>
  )
}

export default App
