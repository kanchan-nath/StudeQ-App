import React, { useEffect, useState } from "react";
import BASE_URL from "../lib/api.js";
const TimeTable = () => {
    const [timeTableForm, setTimeTableForm] = useState({
        title: "",
        topic: "",
        startTime: "",
        endTime: "",
        plannedDuration: "",
        // isRecurring: "",
        // recurrencePattern: "",
        // recurrenceDays: "",
        // recurrenceEndDate: "",
        // status: "",
        // actualDuration: "",
        // goalDescription: "",
        // eminderEnabled: "",
        // reminderMinutesBefore: "",

    })

    const [allTimeTables, setAllTimeTables] = useState([])
    const token = localStorage.getItem("token");


    const handleTimeTableSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body: JSON.stringify(timeTableForm)
            })

            if(!res.ok){
                throw Error("Api call failed")
            }

            const data = await res.json()
            console.log(data);
            
        } catch (error) {
            console.error(error);
            
        }
    }

    const handleChangeTimeTable = async (e) => {
        setTimeTableForm({ ...timeTableForm, [e.target.name]: e.target.value })
    }


    const fetchAllTimeTables = async()=>{
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                throw Error("Api call failed")
            }

            const data = await res.json()

            setAllTimeTables(data.data)
            console.log(data.data);

        } catch (error) {
            console.error(error);

        }
    }

    const handleClick = async(id)=>{
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                throw Error("Api call failed")
            }

            const data = await res.json()

            console.log(data.data);

        } catch (error) {
            console.error(error);

        }
    }

    const handleClickDelete =async(id)=>{
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                throw Error("Api call failed")
            }

            const data = await res.json()
            fetchAllTimeTables()
            console.log(data.data);

        } catch (error) {
            console.error(error);

        }
    }
useEffect(()=>{
    fetchAllTimeTables()
},[])

    return (
        <>

            <div>
                <h1>Time tables</h1>
                <form onSubmit={handleTimeTableSubmit}>
                    <label htmlFor="title">Title</label>
                    <input
                        name="title"
                        type="text"
                        placeholder="Enter title of time table"
                        value={timeTableForm.title}
                        onChange={handleChangeTimeTable}
                        required
                    />

                    <label htmlFor="plannedDuration">plannedDuration</label>
                    <input
                        name="plannedDuration"
                        type="number"
                        placeholder="Enter plannedDuration of time table"
                        value={timeTableForm.plannedDuration}
                        onChange={handleChangeTimeTable}
                        required
                    />

                    <label htmlFor="title">topic</label>
                    <input
                        name="topic"
                        type="text"
                        placeholder="Enter topic of time table"
                        value={timeTableForm.topic}
                        onChange={handleChangeTimeTable}
                        required
                    />

                    <label htmlFor="title">startTime</label>
                    <input
                        name="startTime"
                        type="date"
                        placeholder="Enter start time of time table"
                        value={timeTableForm.startTime}
                        onChange={handleChangeTimeTable}
                        required
                    />

                    <label htmlFor="title">endTime</label>
                    <input
                        name="endTime"
                        type="date"
                        placeholder="Enter end time of time table"
                        value={timeTableForm.endTime}
                        onChange={handleChangeTimeTable}
                        required
                    />

                    {/* <label htmlFor="title">isRecurring</label>
                    <input
                        name="isRecurring"
                        type="checkbox"
                        value={timeTableForm.isRecurring}
                        onChange={handleChangeTimeTable}
                    />

                    <label htmlFor="title">recurrencePattern</label>
                    <input
                        name="recurrencePattern"
                        type="text"
                        value={timeTableForm.recurrencePattern}
                        onChange={handleChangeTimeTable}
                    />

                    <label htmlFor="title">recurrencePattern</label>
                    <input
                        name="recurrencePattern"
                        type="text"
                        value={timeTableForm.recurrencePattern}
                        onChange={handleChangeTimeTable}
                    />

                    <label htmlFor="title">recurrenceEndDate</label>
                    <input
                        name="recurrenceEndDate"
                        type="date"
                        value={timeTableForm.recurrenceEndDate}
                        onChange={handleChangeTimeTable}
                    />

                    <label htmlFor="title">status</label>
                    <input
                        name="status"
                        type="text"
                        value={timeTableForm.status}
                        onChange={handleChangeTimeTable}
                    />

                    <label htmlFor="title">actualDuration</label>
                    <input
                        name="actualDuration"
                        type="number"
                        value={timeTableForm.actualDuration}
                        onChange={handleChangeTimeTable}
                    />

                    <label htmlFor="title">goalDescription</label>
                    <input
                        name="goalDescription"
                        type="text"
                        value={timeTableForm.goalDescription}
                        onChange={handleChangeTimeTable}
                    />

                    <label htmlFor="title">reminderEnabled</label>
                    <input
                        name="reminderEnabled"
                        type="checkbox"
                        value={timeTableForm.reminderEnabled}
                        onChange={handleChangeTimeTable}
                    />

                    <label htmlFor="title">reminderMinutesBefore</label>
                    <input
                        name="reminderMinutesBefore"
                        type="number"
                        value={timeTableForm.reminderMinutesBefore}
                        onChange={handleChangeTimeTable}
                    /> */}
                    <button>Submit</button>
                </form>
            </div>

            <div>
                        
                            {allTimeTables.map((item, ind)=>(
                                <div key={ind}>  
                                    <p>{item._id}</p><button onClick={()=>handleClick(item._id)}>Click</button>
                                    <button onClick={()=>handleClickDelete(item._id)}>Delete</button>
                                </div>
                            ))}
                        
            </div>
            <div>

            </div>
        </>
    );
};

export default TimeTable;
