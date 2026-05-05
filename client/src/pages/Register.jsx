import React from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import BASE_URL from "../lib/api.js"

const Register = () => {

  const [formData, setFormData] = useState({
    name:"",
    email:"",
    password:"",
    grade:""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const handleSubmit =async (e)=>{
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`,{
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      
      if(!res.ok){
        setError(data.message)
      }
      
    } catch (error) {
      console.error("Form submission error", error)
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        {error && 
          <p>{error}</p>
        }
        <label htmlFor="name">Name:</label>
        <input
        name='name' 
        type="text" 
        placeholder='Enter your name'
        value={formData.name}
        onChange={handleChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          name='email'
          type="email"
          placeholder='Enter your email'
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          name='password'
          type="password"
          placeholder='Create a password'
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="grade">Grade:</label>
        <input
          name='grade'
          type="grade"
          placeholder='What is your grade'
          value={formData.grade}
          onChange={handleChange}
        />

        <button
          disabled = {setLoading}
          onClick={ ()=> setLoading(true)}

        >
          {loading ? "Registering": "Register"}
        </button>
      </form>
    </>
  )
}

export default Register
