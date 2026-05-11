import React, { useEffect, useState } from 'react'
import BASE_URL from "../lib/api.js"
import {v4 as uuidv4} from "uuid"
import {useNavigate} from "react-router-dom"

const StudyRoom = () => {
  const [getRooms, setGetRooms] = useState([])
  const token = localStorage.getItem("token")
  const [showButton, setShowButton] = useState(true)
  const [name, setName] = useState("")
  const [roomId, setRoomId] = useState("")

  const navigate = useNavigate()

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

  const handleClick = async()=>{
    setShowButton(false)
  }

  const handleChange = (e)=>{
    setName(e.target.value)
  }

  const handleSubmit = async()=>{
    try {
      const newRoomId = uuidv4()
      const res = await fetch(`${BASE_URL}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, roomId: newRoomId })
      })

      if(!res.ok){
        throw new Error("something went wrong")
      }

      const data = await res.json()
      
      const id = data.roomId
      console.log(id)                     
      setRoomId(id)

    } catch (error) {
      throw new Error(`Room creation failed: ${error.message}`)
    }

  }

  const handleClickJoinButton = (newRoomId)=>{
    
    navigate(`/study-room/${newRoomId}`)

  }
  useEffect(()=>{

    fetchAllRooms()
    
  }, [])
  return (
    <>
      <div>
        {
          showButton ? <button onClick={handleClick}>
            Create Room
          </button> :
          <form onSubmit={handleSubmit} >
            <label htmlFor="name">Room Name: </label>
            <input type="text " value={name} required onChange={handleChange} />
          </form>
        }
        
      </div>

      <div>
        {
          getRooms.map((item,index)=>(
            <div key={index}>
              <h2>Room Name: {item.name}</h2>
              <p>Room Id: {item.id}</p>
              <button onClick={()=>handleClickJoinButton(item.roomId)}>Join </button>
            </div>
          ))
        }
      </div>
    </>
  )
}


export default StudyRoom