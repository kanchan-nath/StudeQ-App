import React from 'react'
import {Navigate, useNavigate}from "react-router-dom"

const ProtectedRoute = ({component}) => {
const token = localStorage.getItem("token")

  return (
    token ? component : <Navigate to="/login" /> 
  )
}

export default ProtectedRoute


  