import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode"
import BASE_URL from "../lib/api.js"
import { useNavigate, Link } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate()

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    grade: ""
  })
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${BASE_URL}/api/user/userinfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();
      setUserData({ ...userData, name: data.data.name, email: data.data.email, grade: data.data.grade })


    };

    fetchData();
  }, []);

  const handleSubmitLogout = (e) => {
    e.preventDefault()
    localStorage.removeItem("token")

    navigate("/login")

  }
  return (
    <>
      <h1>{`Welcome ${userData.name} to SPARK.E`}</h1>
      <h3>Your Details</h3>
      <p>{`Name: ${userData.name}`}</p>
      <p>{`Grade: ${userData.grade}`}</p>
      <p>{`Email: ${userData.email}`}</p>
      <button
        onClick={handleSubmitLogout}
      >Logout</button>

      <nav>
        <Link to="/notes">Notes</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/studyroom">Study Room</Link>
        <Link to="/tutor">Tutor</Link>

      </nav>
    </>
  )
}

export default Dashboard
