import React, { useState } from 'react'
import BASE_URL from "../lib/api.js"
import Loader from "../components/Loader";

const GeneratePlanView = () => {
    const [loader, setLoader] = useState(false)
    const [isGenerate_AI_Study_Plan, setIsGenerate_AI_Study_Plan] = useState(false)
    const [loadingSavePlanButton, setLoadingSavePlanButton] = useState(false)
    const [studyPlanData, setStudyPlanData] = useState({
        subjects: "",
        hoursPerDay: "",
        goalDate: ""
    })

    const [studyPlanDataResult, setStudyPlanDataResult] = useState([])

    const token = localStorage.getItem("token")

    const handlebuttonGenerativeAI = async (e) => {
        e.preventDefault()
        setIsGenerate_AI_Study_Plan(true)
        setLoadingSavePlanButton(true)
        setLoader(true)

        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/generate-plan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(studyPlanData)
            })

            if (!res.ok) {
                throw new Error("response error")
            }

            const data = await res.json()
            setLoader(false)
            setStudyPlanDataResult(data.data)

        } catch (error) {
            console.error(error)
            setLoader(false)

        } finally {
            setIsGenerate_AI_Study_Plan(false)
            setLoader(false)

        }
    }

    const handleChangeStudyPlan = (e) => {
        setStudyPlanData({ ...studyPlanData, [e.target.name]: e.target.value })
    }

    const handleClickSavePlan = async () => {
        setLoader(true)

        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/generate-plan/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    subjects: studyPlanData.subjects,
                    hoursPerDay: studyPlanData.hoursPerDay,
                    goalDate: studyPlanData.goalDate,
                    generatedPlan: studyPlanDataResult
                })
            })

            const data = await res.json()
            setLoader(false)

            console.log(data);

        } catch (error) {
            throw new Error(error)
        }
    }
    if (loader) return <Loader />;  
    return (

        <>
            
            <div>

                {!isGenerate_AI_Study_Plan
                    ? <button onClick={() => setIsGenerate_AI_Study_Plan(true)}>Generate AI Study Plan</button>
                    : <form onSubmit={handlebuttonGenerativeAI}>
                        <label htmlFor="subjects">Subjects: </label>
                        <input
                            type="text"
                            name='subjects'
                            value={studyPlanData.subjects}
                            required
                            onChange={handleChangeStudyPlan}
                        />

                        <label htmlFor="hoursPerDay">Hours Per Day: </label>
                        <input
                            type="number"
                            name='hoursPerDay'
                            value={studyPlanData.hoursPerDay}
                            required
                            onChange={handleChangeStudyPlan}
                        />

                        <label htmlFor="goalDate">Goal Date : </label>
                        <input
                            type="date"
                            name='goalDate'
                            value={studyPlanData.goalDate}
                            required
                            onChange={handleChangeStudyPlan}
                        />
                        <button>Submit</button>
                    </form>
                }
            </div>

            <div>
                {
                    studyPlanDataResult.map((item, index) => (
                        <div key={index}>
                            <h3>Day: {item.day}</h3>
                            <p>Duration: {item.duration}</p>
                            <p>Subject: {item.subject}</p>
                            <p>Topic:{item.topic}</p>
                        </div>
                    ))
                }
                {
                    loadingSavePlanButton && <button onClick={handleClickSavePlan}>  Save Plan</button>
                }
            </div>
        </>

    )
}

export default GeneratePlanView
