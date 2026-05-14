import React from 'react'
import { useState } from 'react'
import BASE_URL from "../lib/api.js"
import {v4 as uuidv4} from "uuid"

const Flashcards = () => {
    const [input, setInput] = useState({
        topic:"",
        subject:""
    })
    const [flashcardId, setFlashcardId] = useState("")
    const [loading, setLoading] = useState(false)
    const [inputResult, setInputResult]= useState({})

    const token = localStorage.getItem("token")

    const handleChange = (e)=>{
        setInput({...input, [e.target.name]:e.target.value})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        setLoading(true)
        const {topic, subject} = input
        const id = uuidv4()
        setFlashcardId(id)
        
        try {
            const res = await fetch(`${BASE_URL}/api/quiz/flashcards`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body: JSON.stringify({ topic, subject, flashcardId:id })
            })

            if(!res.ok){
                console.error("Something went wrong, Try Again!")
            }
            const data = await res.json()
            console.log(data);
            
            setInputResult(data)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }finally{
            setLoading(false)
        }

    }
    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="topic">Topic</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name='topic'
                        value={input.topic}
                    />

                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        name='subject'
                    />
                    <button disabled = {loading} >{loading ? "Generating":"Generate"}</button>
                </form>
            </div>

            <div>
                
            </div>
        </>
    )
}

export default Flashcards
