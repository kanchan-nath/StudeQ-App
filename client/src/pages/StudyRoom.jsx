import React, { useEffect, useState } from 'react'
import BASE_URL from "../lib/api.js"

const StudyRoom = () => {
  const [getRooms, setGetRooms] = useState([])
  const token = localStorage.getItem("token")

  const fetchAllRooms = async()=>{
    try {
      const res = await fetch(`${BASE_URL}/api/rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await res.json()
      
      setGetRooms(data.data)

    } catch (error) {
      throw new Error("Fetching problem", error)
    }
    

  }
  useEffect(()=>{

    fetchAllRooms()
    console.log(getRooms);
    
  }, [])
  return (
    <>
      <div>
        <button>
          Create Room
        </button>
      </div>
      <div>
        {
          getRooms.map((item,index)=>(
            <div key={index}>
              <h2>Room Name: {item.name}</h2>
              <p>Room Id: {item.id}</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default StudyRoom
