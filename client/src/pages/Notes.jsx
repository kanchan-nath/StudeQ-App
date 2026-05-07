import React from 'react'
import { useState } from 'react'
import BASE_URL from "../lib/api.js"
import { useEffect } from 'react'

const Notes = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState("")
  const [summaryData, setSummaryData] = useState({
    title:"",
    summary:"",
    keyPoints:"",
  })

  const [notes,setNotes] = useState([])
  const [fetchError, setFetchError] = useState("")
  const [fetching, setFetching] = useState(false)

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

      fetchNotes()

    } catch (error) {
      setError(error || "Content generation failed")
    } finally {
      setLoading(false)
    }

  }
  const fetchNotes = async()=>{
    setFetching(true)

    try {
      const res = await fetch(`${BASE_URL}/api/notes`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      if(!res.ok){
        throw new Error("fetching problem")
      }

      const data = await res.json()
      setNotes(data.data)      
      
    } catch (error) {
      setFetchError(error)
    }finally{
      setFetching(false)
    }
  }

  const handleSubmitDelete = async(id)=>{

    try {
      const res = await fetch(`${BASE_URL}/api/notes/${id}`,{
        method:"DELETE",
        headers:{
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })

      const data = await res.json()
      fetchNotes()
      
    } catch (error) {
      throw new Error(error)
    }
  }

  useEffect(()=>{
    fetchNotes()
  }, [])
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

      <div>
        <h1>All Chats</h1>
        
        <div>
          {notes.map((note)=>(
            <div key={note._id}>
              <h3>{note.title}</h3>
              <p>{note.summary}</p>
              <button onClick={()=> handleSubmitDelete(note._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Notes
