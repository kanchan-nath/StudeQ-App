import React from 'react'
import { useState } from 'react'
import BASE_URL from "../lib/api.js"

const Tutor = () => {
  const [question, setQuestion] = useState("")
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const[questionAnswerData, setQuestionAnswerData] = useState("")
  const token = localStorage.getItem("token")

  const handleChangeQuestion = async(e)=>{
    setQuestion(e.target.value)
  }
  const handleSubmitQuestion = async(e)=>{
    e.preventDefault()
    setSending(true)
    setError("")

    try {
      const res =await fetch(`${BASE_URL}/api/tutor/ask`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
          "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify({question})
      })

      const data = await res.json()
      setQuestionAnswerData(data.data)

    } catch (error) {
      setError(error)
    }finally{
        setSending(false)
      }
  }
  return (
    <>
      <form onSubmit={handleSubmitQuestion}>

        <input type="text" required onChange={handleChangeQuestion} value={question} name='question' />
        <button>
          Ask
        </button>
      </form>

      {question && 
        <div>
          <p>{question}</p>
          <p>{questionAnswerData}</p>
        </div>
      }
    </>
  )
}

export default Tutor
