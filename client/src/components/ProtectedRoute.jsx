// import React from 'react'
// import {Navigate, useNavigate}from "react-router-dom"

// const ProtectedRoute = ({component}) => {
// const token = localStorage.getItem("token")

//   return (
//     token ? component : <Navigate to="/login" /> 
//   )
// }

// export default ProtectedRoute


import { useAuth } from "@clerk/react"
import { Navigate } from "react-router-dom"

// Keeps the same prop API: <ProtectedRoute component={<SomePage />} />
const ProtectedRoute = ({ component }) => {
  const { isLoaded, isSignedIn } = useAuth()

  // Clerk is still initialising — render nothing to avoid flash
  if (!isLoaded) return null

  // Not signed in → kick to login
  if (!isSignedIn) return <Navigate to="/login" replace />

  return component
}

export default ProtectedRoute