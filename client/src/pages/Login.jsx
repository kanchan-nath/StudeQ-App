import React, { useEffect } from 'react'
import {useNavigate} from "react-router-dom"
import BASE_URL from "../lib/api.js"
import { useState } from 'react'

const Login = () => {

  const navigate = useNavigate()
  const [formData, setFormData]  = useState({
    email:"",
    password:"",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      
      if (!res.ok){
        const data = await res.json()
        return setError(data.message || "Login failed")
      }

      const data = await res.json()
      
      const token = data.data.accessToken
      
      localStorage.setItem("token", token)
      navigate("/dashboard")
      
    } catch (error) {
      console.error("Login faliure", error)
    }finally{
      setLoading(false)
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Login </h2>
        {error &&
          <p>{error}</p>
        }
        <label htmlFor="email">Email:</label>
        <input 
        type="email" 
        onChange={handleChange}
        placeholder='Your email'
        required
        name= "email"
        value={formData.email}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          onChange={handleChange}
          placeholder='Your password'
          required
          name="password"
          value={formData.password}
        />

        <button
          disabled = {loading}

        >
          {loading ? "redirecting to dashboard":"Login"}
        </button>
      </form>
    </>
  )
}

export default Login
