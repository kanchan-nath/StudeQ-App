import React from 'react'
import { useState } from 'react'
import BASE_URL from "../lib/api.js"

const Notes = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")
  const [summaryData, setSummaryData] = useState({
    title:"",
    summary:"",
    keyPoints:"",
  })
  const token = localStorage.getItem("token")

  const handleChange = async (e) => {
    setContent(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${BASE_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({content})
      })

      if (!res.ok) {
        throw new Error("Something went wrong, Try again")
      }

      const data = await res.json()
      const{title, summary, keyPoints} = data.data

      setSummaryData({ title, summary, keyPoints })
      console.log(data)


    } catch (error) {
      setError(error || "Content generation failed")
    } finally {
      setLoading(false)
    }

  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="content">Content</label>
        <input name='content' value={content} type="text" placeholder='What you want to know?' required onChange={handleChange} />
        <button disabled={loading}>
          Summarize & Save
        </button>

      </form>

      {(summaryData.title && summaryData.summary && summaryData.keyPoints) && 
      <div>
        <h1>{`Title: ${summaryData.title}`}</h1>
        <p>{`Summary Data: ${summaryData.summary}`}</p>
        <p>{`Key Points: ${summaryData.keyPoints}`}</p>
      </div>
      }
    </>
  )
}

export default Notes
