import React, { useEffect, useState } from 'react'
import BASE_URL from "../lib/api.js"
const Scheduler = () => {
    const [formData, setFormData] = useState({
        subject: "",
        topic: "",
        schedulerDate: "",
        duration: "",
        completed: false
    })
    const [loading, setLoading] = useState(false)
    const [formResult, setFormResult] = useState([])
    const [formDataResult, setFormDataResult] = useState({})
    const token = localStorage.getItem("token")

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        console.log("data:");

        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch(`${BASE_URL}/api/scheduler`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            )

            const data = await res.json()
            setFormDataResult(data.data)

            setFormData("")

        } catch (error) {
            throw new Error(`Scheduler creation problem ${error}`)
        } finally {
            setLoading(false)
        }
    }

    const fetchData = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler`, {
                method: "GET",
                headers: {

                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            const data = await res.json()

            setFormResult(data.data)

        } catch (error) {
            console.error(error)
        }
    }

    const handleClickCompletedButton = async (e, schedulerId) => {
        try {
            setFormData({ ...formData, [e.target.name]: true })
            console.log(schedulerId);

            const res = await fetch(`${BASE_URL}/api/scheduler/${schedulerId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ completed: true })
            })

            const data = await res.json()
            console.log(data);
        } catch (error) {
            console.error(error)
        }


    }

    useEffect(() => {
        fetchData()

    }, [formDataResult])

    return (

        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="subject">Subject: </label>
                    <input
                        type="text"
                        name='subject'
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="topic">Topic: </label>
                    <input
                        type="text"
                        name='topic'
                        value={formData.topic}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="date">Date: </label>
                    <input
                        type="date"
                        name='schedulerDate'
                        value={formData.schedulerDate}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="duration">Duration: </label>
                    <input
                        type="text"
                        name='duration'
                        value={formData.duration}
                        onChange={handleChange}
                        required
                    />
                    <button disabled={loading}>
                        Create Scheduler
                    </button>
                </form>
            </div>

            <div>
                {
                    formResult.map((item, index) => (
                        <div key={index}>
                            <p>Subject: {item.subject} </p>
                            <p>Topic: {item.topic}</p>
                            <p>Date:  {new Date(item.schedulerDate).toLocaleDateString()}</p>
                            <p>Duration: {item.duration}</p>
                            <p>Completed: <button name='completed' onClick={(e) => handleClickCompletedButton(e, item._id)}>Done</button></p>
                        </div>
                    ))
                }
            </div>
        </>

    )
}

export default Scheduler
