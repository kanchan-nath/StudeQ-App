import React, { useEffect, useState } from "react";
import BASE_URL from "../lib/api.js";

const TimeTable = () => {
    const [timeTableForm, setTimeTableForm] = useState({
        title: "",
        topic: "",
        startTime: "",
        endTime: "",
        plannedDuration: "",
    })

    const [updateForm, setUpdateForm] = useState({
        title: "",
        topic: "",
        startTime: "",
        endTime: "",
        plannedDuration: "",
    })

    const [allTimeTables, setAllTimeTables] = useState([])
    const [selectedTimeTable, setSelectedTimeTable] = useState(null)
    const [updateId, setUpdateId] = useState(null)
    const token = localStorage.getItem("token");


    const handleTimeTableSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(timeTableForm)
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            console.log(data);
            fetchAllTimeTables()
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangeTimeTable = async (e) => {
        setTimeTableForm({ ...timeTableForm, [e.target.name]: e.target.value })
    }

    const handleChangeUpdate = async (e) => {
        setUpdateForm({ ...updateForm, [e.target.name]: e.target.value })
    }


    const fetchAllTimeTables = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            setAllTimeTables(data.data)
            console.log(data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleClick = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            setSelectedTimeTable(data.data)
            console.log(data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleClickDelete = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            fetchAllTimeTables()
            console.log(data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table/${updateId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateForm)
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            console.log(data);
            setUpdateId(null)
            fetchAllTimeTables()
        } catch (error) {
            console.error(error);
        }
    }

    const handleDownloadICS = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/time-table/${id}/ics`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!res.ok) throw Error("Api call failed")
            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `timetable-${id}.ics`
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchAllTimeTables()
    }, [])

    return (
        <>
            <div>
                <h1>Time tables</h1>
                <form onSubmit={handleTimeTableSubmit}>
                    <label>Title</label>
                    <input name="title" type="text" placeholder="Enter title of time table" value={timeTableForm.title} onChange={handleChangeTimeTable} required />

                    <label>plannedDuration</label>
                    <input name="plannedDuration" type="number" placeholder="Enter plannedDuration of time table" value={timeTableForm.plannedDuration} onChange={handleChangeTimeTable} required />

                    <label>topic</label>
                    <input name="topic" type="text" placeholder="Enter topic of time table" value={timeTableForm.topic} onChange={handleChangeTimeTable} required />

                    <label>startTime</label>
                    <input name="startTime" type="date" placeholder="Enter start time of time table" value={timeTableForm.startTime} onChange={handleChangeTimeTable} required />

                    <label>endTime</label>
                    <input name="endTime" type="date" placeholder="Enter end time of time table" value={timeTableForm.endTime} onChange={handleChangeTimeTable} required />

                    <button>Submit</button>
                </form>
            </div>

            <div>
                {allTimeTables.map((item, ind) => (
                    <div key={ind}>
                        <p>{item._id}</p>
                        <p>{item.title}</p>
                        <button onClick={() => handleClick(item._id)}>View</button>
                        <button onClick={() => { setUpdateId(item._id); setUpdateForm({ title: item.title, topic: item.topic, startTime: item.startTime, endTime: item.endTime, plannedDuration: item.plannedDuration }) }}>Edit</button>
                        <button onClick={() => handleClickDelete(item._id)}>Delete</button>
                        <button onClick={() => handleDownloadICS(item._id)}>Download ICS</button>
                    </div>
                ))}
            </div>

            {selectedTimeTable && (
                <div>
                    <h2>Selected Time Table</h2>
                    <p>{selectedTimeTable[0]?.title}</p>
                    <p>{selectedTimeTable[0]?.topic}</p>
                    <p>{selectedTimeTable[0]?.startTime}</p>
                    <p>{selectedTimeTable[0]?.endTime}</p>
                    <p>{selectedTimeTable[0]?.plannedDuration}</p>
                    <button onClick={() => setSelectedTimeTable(null)}>Close</button>
                </div>
            )}

            {updateId && (
                <div>
                    <h2>Update Time Table</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <label>Title</label>
                        <input name="title" type="text" value={updateForm.title} onChange={handleChangeUpdate} />

                        <label>plannedDuration</label>
                        <input name="plannedDuration" type="number" value={updateForm.plannedDuration} onChange={handleChangeUpdate} />

                        <label>topic</label>
                        <input name="topic" type="text" value={updateForm.topic} onChange={handleChangeUpdate} />

                        <label>startTime</label>
                        <input name="startTime" type="date" value={updateForm.startTime} onChange={handleChangeUpdate} />

                        <label>endTime</label>
                        <input name="endTime" type="date" value={updateForm.endTime} onChange={handleChangeUpdate} />

                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setUpdateId(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default TimeTable;