import React, { useRef } from 'react'
import { useState } from 'react'
import BASE_URL from "../lib/api.js"
import { v4 as uuidv4 } from "uuid"
import { useEffect } from 'react'

const Flashcards = () => {
    const [pdfFilePath, setPdfFilePath] = useState("")
    const [moreFlashId, setMoreFlashId] = useState("")
    const [input, setInput] = useState({
        topic: "",
        subject: ""
    })
    const [flashcardId, setFlashcardId] = useState("")
    const [loading, setLoading] = useState(false)
    const [inputResult, setInputResult] = useState({})
    const [allFlashcards, setAllFlashcards] = useState([])

    const inputRef = useRef(null)

    const token = localStorage.getItem("token")

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { topic, subject } = input
        const id = uuidv4()
        setFlashcardId(id)

        if (moreFlashId) {
            try {
                const res = await fetch(`${BASE_URL}/api/quiz/flashcards/${moreFlashId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ topic, subject, flashcardId: id })
                })

                if (!res.ok) {
                    console.error("something went wrong")
                }

                const data = await res.json()
                console.log(data);
                fetchFlashcards()

            } catch (error) {
                console.error(error)
                setLoading(false)

            } finally {
                setLoading(false)

            }
        } else {
            try {
                const res = await fetch(`${BASE_URL}/api/quiz/flashcards`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ topic, subject, flashcardId: id })
                })

                if (!res.ok) {
                    console.error("Something went wrong, Try Again!")
                }
                const data = await res.json()
                console.log(data);

                setInputResult(data.data)

                setInput({ topic: "", subject: "" })
                fetchFlashcards()
            } catch (error) {
                console.error(error)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }



    }

    const fetchFlashcards = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/quiz/flashcards`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                console.error(`Something went wrong, Try Again`)
            }

            const data = await res.json()

            setAllFlashcards(data.data)

        } catch (error) {
            console.error(error)
        }
    }

    const handleClickDelete = async (id) => {
        console.log(id);

        try {
            const res = await fetch(`${BASE_URL}/api/quiz/flashcards/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                console.error("Something went wrnog, Try Again!")
            }
            fetchFlashcards()
            const data = await res.json()

        } catch (error) {
            console.error(error)
        }


    }

    const handleClickAddMoreFlash = async (item) => {
        setMoreFlashId(item._id)
        setInput({ topic: item.topic, subject: item.subject })
        setTimeout(() => inputRef.current?.focus(), 0)



    }

    const handleClickPdfFlash = async()=>{
        try {
            const res = await fetch(`${BASE_URL}/api/quiz/flashcards`,{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${token}`
                },
                body: JSON.stringify({pdfFilePath})
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleChangePdfFlash = (e)=>{
        setPdfFilePath(e.target.files[0])
    }

    useEffect(() => {
        fetchFlashcards()

    }, [])
    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="topic">Topic</label>
                    <input
                        ref={inputRef}
                        type="text"
                        onChange={handleChange}
                        name='topic'
                        value={input.topic}
                    />

                    <label htmlFor="subject">Subject:</label>
                    <input
                        ref={inputRef}
                        type="text"
                        onChange={handleChange}
                        name='subject'
                    />
                    <button disabled={loading} >{loading ? "Generating" : "Generate"}</button>
                </form>
            </div>

            <div>
                {
                    inputResult?.flashcards?.map((item, index) => (
                        <div key={index}>
                            <p><strong>Front</strong>: {item.front}</p>

                            <p><strong>Back</strong>: {item.back}</p>
                        </div>
                    ))
                }
            </div>

            <div>
                <h1>All Flashcards</h1>
                <div>
                    {
                        allFlashcards.map((item, index) => (
                            <div key={index}>
                                <h3>Topic: {item.topic}, Subjects:{item.subject}</h3>
                                <h4>Difficulty Level: {item.difficultyLevel}</h4>
                                {
                                    item.flashcards.map((flashcard, id) => (
                                        <div key={id}>
                                            <p><strong>Front</strong>: {flashcard.front}</p>

                                            <p><strong>Back</strong>: {flashcard.back}</p>
                                        </div>
                                    ))
                                }
                                <button onClick={() => handleClickDelete(item._id)}>Delete</button>
                                <button onClick={() => handleClickAddMoreFlash(item)}>Add more Flashcard</button>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div>
                <input
                    type="file"
                    onChange={handleChangePdfFlash}
                />
                <button onClick={handleClickPdfFlash}>Generate</button>
            </div>
        </>
    )
}

export default Flashcards
