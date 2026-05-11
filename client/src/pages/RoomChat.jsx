import React, { useEffect, useState, useSyncExternalStore } from 'react'
import { socket } from "../lib/socket.js"
import useUser from "../ContextApi/useUser.js"

const RoomChat = () => {
  const [message, setMessage] = useState([])
  const [text, setText] = useState("")
  const { user } = useUser()
  const [joinUser, setJoinUser] = useState("")
  const name = user?.name?.toUpperCase()
  const roomId = "1"

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const sendMessage = () => {
    const msg = {
      id:Date.now(),
      sender:name,
      text: text,
      time:Date.now(),
      roomId,
    }

    // setMessage((prev)=>[...prev, msg])

    socket.emit("send_message",msg)
  }
  useEffect(() => {
    if (!name) return
    socket.emit("join_room", { name, roomId })

    socket.on("join_room_notice", (data) => {
      console.log(`${data.name} joined  the room`);
      
    setJoinUser(data.name)
    })

    socket.on("send_message",(data)=>{
      setMessage((prev)=>[...prev, data])
    })

    return ()=>{
      socket.off("join_room")
      socket.off("join_room_notice")
      socket.off("send_message")
    }

  }, [ name])
  return (
    <>
      <div>
        <textarea
          name="chat_message"
          placeholder='Typing a message...'
          rows="1"
          autoFocus
          value={text}
          onChange={handleChange}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        {message.map((msg) => (
          <h1 key={msg.id}>{msg.sender}:{msg.text}</h1>
        ))}
      </div>
    </>


  )
}

export default RoomChat
