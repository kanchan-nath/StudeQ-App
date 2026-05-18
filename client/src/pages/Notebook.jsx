import React, { useRef } from 'react'
import { useState } from 'react'
import BASE_URl from "../lib/api.js"
import { useEffect } from 'react'

const Notebook = () => {
    const [inputFile, setInputFile] = useState("")
    const [loading, setLoading] = useState(false)
    const [inputFileResult, setInputFileResult] = useState({})
    const [chatRoom, setChatRoom] = useState(false)
    const [query, setQuery] = useState("")
    const [loadingSendQuery, setLoadingQuery] = useState(false)
    const [queryResult, setQueryResult] = useState({})
    const [result, setResult] = useState([])
    const inputRef = useRef(null)
    const [editId, setEditId] = useState("")

    const token = localStorage.getItem("token")

    const handleChangeFile = async (e) => {
        setInputFile(e.target.files[0])
    }

    const handleClickSubmit = async () => {
        setLoading(true)

        const formData = new FormData()

        formData.append("file", inputFile)

        if(editId){
            try {
                const res = await fetch(`${BASE_URl}/api/documents/${id}/chat/${chatRoomKey}/${editId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(inputFile)
                })

                if(!res.ok){
                    throw new Error("query edit problem, Try again!")
                }

                const data = await res.json()

                setInputFileResult(data.data)
            } catch (error) {
                console.error(error)
            }
        }else{
            try {
                const res = await fetch(`${BASE_URl}/api/documents/upload`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                })

                if (!res.ok) {
                    throw new Error("File uploading failed")
                }
                setChatRoom(true)

                const data = await res.json()
                console.log(data);

                setInputFileResult(data.data)
                setInputFile("")
                setLoading(false)

            } catch (error) {
                console.error(error)
                setLoading(false)

            } finally {
                setLoading(false)
            }
        }

       
    }

    const handleChangeQuery = (e) => {
        setQuery(e.target.value)
    }
    const handleSubmitQuery = async (e) => {
        e.preventDefault()
        setLoadingQuery(true)

        try {
            const res = await fetch(`${BASE_URl}/api/documents/${inputFileResult.id}/chat/${inputFileResult.chatRoomKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ query })
            })

            if (!res.ok) {
                throw new Error(`Message not send, Try again!`)
            }

            const data = await res.json()
            setQueryResult(data.data)
            setQuery("")
            fetchAllMessages()
            console.log(data);
        } catch (error) {
            console.error(error)
            setLoadingQuery(false)

        } finally {
            setLoadingQuery(false)
        }
    }


    const fetchAllMessages = async () => {
        try {
            const res = await fetch(`${BASE_URl}/api/documents/${inputFileResult.id}/chat/${inputFileResult.chatRoomKey}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })

            if (!res.ok) {
                throw new Error("All chat not fetched")
            }

            const data = await res.json()
            console.log(data);

            setResult(data.data)

        } catch (error) {
            console.error(error)
        }
    }

    const handleClickEdit = async (messageId)=>{
        setEditId(messageId)
        setQuery("")
        setTimeout(()=> inputRef.current?.focus(), 100)
    }

    useEffect(() => {        
        fetchAllMessages()
    }, [])

    return (
        <>
            <div>
                <input type="file" onChange={handleChangeFile} />
                <button onClick={handleClickSubmit}>{loading ? "Submiting" : "Submit"}</button>
            </div>

            {chatRoom ?
                <div>
                    <form onSubmit={handleSubmitQuery}>
                        <input
                            type="text"
                            ref={inputRef}
                            onChange={handleChangeQuery}
                            value={query}
                        />
                        <button>{loadingSendQuery ? "Sending" : "Send"}</button>
                    </form>
                </div>
                : ""}

            <div>
                {result.map((item, index) => (
                    <div key={index}>
                        {item.messages.map((value, i) => (
                            <div key={i}>
                                
                                <p>User: {value.role === "user" && <button onClick={()=>handleClickEdit(value._id)}>Edit</button>}</p>
                                <p>Content: {value.content}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </> 
    )
}

export default Notebook
