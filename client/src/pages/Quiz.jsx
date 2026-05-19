import React from 'react'
import { useState } from 'react'
import BASE_URL from "../lib/api.js"
import { useEffect } from 'react'
import { v4 as uuidv4 } from "uuid"
const Quiz = () => {
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("")
  const [quiz, setQuiz] = useState([{}])
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState("" || null)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState("idle" || "loading" || "quiz" || "result")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [quizId, setQuizId] = useState("")
  const [allQuizResult, setAllQuizResult] = useState([])

  const token = localStorage.getItem("token")

  const handleTopicChange = (e) => {
    setTopic(e.target.value)
  }

  const handleSubmitQuiz = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${BASE_URL}/api/quiz/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ topic, subject, quizId })
      })

      const data = await res.json()

      setQuiz(data.data)
      console.log(data);

      console.log(quiz);
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }

  }

  const handleClick = async (e, item) => {
    const selected = e.target.value

    if (selected === item.answer) {
      setScore((prevScore) => prevScore + 1)
    } else {
      setScore((prevScore) => prevScore - 1)

    }

    console.log(score);

  }

  const fetchAllQuiz = async()=>{
    try {
      const res = await fetch(`${BASE_URL}/api/quiz/all`,{
        method:"GET",
        headers:{
          "Content-Type":"application.json",
          "Authorization":`Bearer ${token}`
        }
      })

      if(!res.ok){
        throw new Error("not all quiz fetchd")
      }

      const data = await res.json()
      console.log(data);
      setAllQuizResult(data.data)
      
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    setQuizId(uuidv4())
  }, [])

  useEffect(()=>{
    fetchAllQuiz()
  },[])

  return (
    <>
      <div>
        <form onSubmit={handleSubmitQuiz}>
          <label htmlFor="input">Topic & Subject</label>
          <input
            type="text"
            name='topic'
            placeholder='ENter your topic'
            required
            value={topic}
            onChange={handleTopicChange}
          />
          <button disabled={loading}>
            {loading ? "Generating" : "Generate"}
          </button>
        </form>

        <div>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="math">Math</option>
            <option value="english">English</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="Bengali">Bengali</option>
            <option value="life-science">Life Science</option>
          </select>
        </div>
      </div>

      {/* <div>
        {
          quiz?.map((item, index) => (
            <div key={index}>
              <p>{quiz[index].question}</p>
              {
                item?.options?.map((opt, optIndex) => (
                  <button key={optIndex} value={opt.optionId} onClick={(e)=>handleClick(e, item)}>
                    {opt.optionId}: {opt.text}
                  </button>
                ))
              }
            </div>
          ))
        }
      </div> */}

      
      <div>
        <p>{quiz[currentQuizIndex].question}</p>
        <div>
          {
            quiz[currentQuizIndex]?.options?.map((item, index)=>(
              <button key={index} value={item.optionId} onClick={(e) => handleClick(e, item)}>  {item.optionId}: {item.text}</button>
            ))
          } 
        </div>
      </div>

      <div>
        {
          allQuizResult.map((item,index)=>(
            <div key={index}>
              {
                item.quiz.map((quiz, i)=>(
                  <div key={i}>
                    <p>{quiz.question}</p>
                    {quiz.options.map((option,j)=>(
                      <div key={j}>
                        <p>{option.optionId}</p>
                        <p>{option.text}</p>

                      </div>
                    ))}
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

export default Quiz
