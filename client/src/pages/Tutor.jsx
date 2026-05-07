import React from 'react'
import { useState } from 'react'
import BASE_URL from "../lib/api.js"
import { useEffect } from 'react'
import { v4 as uuidv4 } from "uuid";

const Tutor = () => {
  const [question, setQuestion] = useState("")
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const [questionAnswerData, setQuestionAnswerData] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [sessionId, setSessionId] = useState("")

  const token = localStorage.getItem("token")

  const handleChangeQuestion = async (e) => {
    setQuestion(e.target.value)
  }
  const handleSubmitQuestion = async (e) => {
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      const res = await fetch(`${BASE_URL}/api/tutor/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ question, sessionId })
      })

      const data = await res.json()
      setQuestionAnswerData(data.data)
      fetchChatHistory()
    } catch (error) {
      setError(error)
    } finally {
      setSending(false)
    }
  }

  const fetchChatHistory = async () => {
    const res = await fetch(`${BASE_URL}/api/tutor/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

    const data = await res.json()

    setChatHistory(data.data)

  }
  useEffect(() => {
    setSessionId(uuidv4())
    fetchChatHistory()
  }, [])
  return (
    <>
      <form onSubmit={handleSubmitQuestion}>

        <input type="text" required onChange={handleChangeQuestion} value={question} name='question' />
        <button disabled = {sending}>
          {sending ? "Genereting" : "Ask"}
        </button>
      </form>

      {question &&
        <div>
          <p>{question}</p>
          <p>{questionAnswerData}</p>
        </div>
      }

      <div>
        <h1>Chat Conversation</h1>
        {
          chatHistory.map((chat)=>(
            <div key={chat._id}>
              {
                chat.messages.map((item, index)=>(
                  <div key={index}>

                    <p>
                      <strong>{item.role}:</strong> {item.content}
                    </p>

                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Tutor
