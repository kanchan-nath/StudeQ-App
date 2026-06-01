import React, { useEffect, useState } from "react";
import BASE_URL from "../lib/api.js";

// ─── Exam Scheduler ───────────────────────────────────────────────────────────

const ExamScheduler = () => {
    const [examForm, setExamForm] = useState({
        subjectName: "", examDate: "", examTime: "", duration: "",
        venue: "", onlineLink: "", subjectCode: "", notes: "",
        reminderEnabled: false, reminderDaysBefore: "", status: ""
    })
    const [updateForm, setUpdateForm] = useState({ ...examForm })
    const [allExams, setAllExams] = useState([])
    const [selectedExam, setSelectedExam] = useState(null)
    const [updateId, setUpdateId] = useState(null)
    const token = localStorage.getItem("token")

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setExamForm({ ...examForm, [name]: type === "checkbox" ? checked : value })
    }

    const handleChangeUpdate = (e) => {
        const { name, value, type, checked } = e.target
        setUpdateForm({ ...updateForm, [name]: type === "checkbox" ? checked : value })
    }

    const fetchAll = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/exam-dates`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            setAllExams(data.data)
        } catch (error) { console.error(error) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/exam-dates`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(examForm)
            })
            if (!res.ok) throw Error("Api call failed")
            fetchAll()
        } catch (error) { console.error(error) }
    }

    const handleView = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/exam-dates/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            setSelectedExam(data.data)
        } catch (error) { console.error(error) }
    }

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/exam-dates/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw Error("Api call failed")
            fetchAll()
        } catch (error) { console.error(error) }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/${updateId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(updateForm)
            })
            if (!res.ok) throw Error("Api call failed")
            setUpdateId(null)
            fetchAll()
        } catch (error) { console.error(error) }
    }

    useEffect(() => { fetchAll() }, [])

    return (
        <>
            <h1>Exam Scheduler</h1>
            <form onSubmit={handleSubmit}>
                <label>Subject Name</label>
                <input name="subjectName" type="text" value={examForm.subjectName} onChange={handleChange} required />
                <label>Exam Date</label>
                <input name="examDate" type="date" value={examForm.examDate} onChange={handleChange} required />
                <label>Exam Time</label>
                <input name="examTime" type="time" value={examForm.examTime} onChange={handleChange} required />
                <label>Duration</label>
                <input name="duration" type="number" value={examForm.duration} onChange={handleChange} />
                <label>Venue</label>
                <input name="venue" type="text" value={examForm.venue} onChange={handleChange} />
                <label>Online Link</label>
                <input name="onlineLink" type="text" value={examForm.onlineLink} onChange={handleChange} />
                <label>Subject Code</label>
                <input name="subjectCode" type="text" value={examForm.subjectCode} onChange={handleChange} />
                <label>Notes</label>
                <input name="notes" type="text" value={examForm.notes} onChange={handleChange} />
                <label>Reminder Enabled</label>
                <input name="reminderEnabled" type="checkbox" checked={examForm.reminderEnabled} onChange={handleChange} />
                <label>Reminder Days Before</label>
                <input name="reminderDaysBefore" type="number" value={examForm.reminderDaysBefore} onChange={handleChange} />
                <label>Status</label>
                <input name="status" type="text" value={examForm.status} onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>

            <div>
                {allExams.map((item, ind) => (
                    <div key={ind}>
                        <p>{item._id}</p>
                        <p>{item.subjectName}</p>
                        <button onClick={() => handleView(item._id)}>View</button>
                        <button onClick={() => { setUpdateId(item._id); setUpdateForm({ subjectName: item.subjectName, examDate: item.examDate, examTime: item.examTime, duration: item.duration, venue: item.venue, onlineLink: item.onlineLink, subjectCode: item.subjectCode, notes: item.notes, reminderEnabled: item.reminderEnabled, reminderDaysBefore: item.reminderDaysBefore, status: item.status }) }}>Edit</button>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                ))}
            </div>

            {selectedExam && (
                <div>
                    <h2>Selected Exam</h2>
                    <p>{selectedExam[0]?.subjectName}</p>
                    <p>{selectedExam[0]?.examDate}</p>
                    <p>{selectedExam[0]?.examTime}</p>
                    <p>{selectedExam[0]?.venue}</p>
                    <p>{selectedExam[0]?.status}</p>
                    <button onClick={() => setSelectedExam(null)}>Close</button>
                </div>
            )}

            {updateId && (
                <div>
                    <h2>Update Exam</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <label>Subject Name</label>
                        <input name="subjectName" type="text" value={updateForm.subjectName} onChange={handleChangeUpdate} />
                        <label>Exam Date</label>
                        <input name="examDate" type="date" value={updateForm.examDate} onChange={handleChangeUpdate} />
                        <label>Exam Time</label>
                        <input name="examTime" type="time" value={updateForm.examTime} onChange={handleChangeUpdate} />
                        <label>Duration</label>
                        <input name="duration" type="number" value={updateForm.duration} onChange={handleChangeUpdate} />
                        <label>Venue</label>
                        <input name="venue" type="text" value={updateForm.venue} onChange={handleChangeUpdate} />
                        <label>Online Link</label>
                        <input name="onlineLink" type="text" value={updateForm.onlineLink} onChange={handleChangeUpdate} />
                        <label>Subject Code</label>
                        <input name="subjectCode" type="text" value={updateForm.subjectCode} onChange={handleChangeUpdate} />
                        <label>Notes</label>
                        <input name="notes" type="text" value={updateForm.notes} onChange={handleChangeUpdate} />
                        <label>Reminder Enabled</label>
                        <input name="reminderEnabled" type="checkbox" checked={updateForm.reminderEnabled} onChange={handleChangeUpdate} />
                        <label>Reminder Days Before</label>
                        <input name="reminderDaysBefore" type="number" value={updateForm.reminderDaysBefore} onChange={handleChangeUpdate} />
                        <label>Status</label>
                        <input name="status" type="text" value={updateForm.status} onChange={handleChangeUpdate} />
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setUpdateId(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </>
    )
}

// ─── Assignment Submission Scheduler ─────────────────────────────────────────

const AssignmentSubmissionScheduler = () => {
    const [form, setForm] = useState({
        dueDate: "", allowLateSubmission: false, linkedAssignmentId: ""
    })
    const [updateForm, setUpdateForm] = useState({
        dueDate: "", submittedAt: "", submissionStatus: "", feedback: "",
        allowLateSubmission: false, linkedAssignmentId: ""
    })
    const [allAssignments, setAllAssignments] = useState([])
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [updateId, setUpdateId] = useState(null)
    const token = localStorage.getItem("token")

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === "checkbox" ? checked : value })
    }

    const handleChangeUpdate = (e) => {
        const { name, value, type, checked } = e.target
        setUpdateForm({ ...updateForm, [name]: type === "checkbox" ? checked : value })
    }

    const fetchAll = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/assignment-submission`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            setAllAssignments(data.data)
        } catch (error) { console.error(error) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/assignment-submission`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(form)
            })
            if (!res.ok) throw Error("Api call failed")
            fetchAll()
        } catch (error) { console.error(error) }
    }

    const handleView = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/assignment-submission/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            setSelectedAssignment(data.data)
        } catch (error) { console.error(error) }
    }

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/assignment-submission/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw Error("Api call failed")
            fetchAll()
        } catch (error) { console.error(error) }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/assignment-submission/${updateId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(updateForm)
            })
            if (!res.ok) throw Error("Api call failed")
            setUpdateId(null)
            fetchAll()
        } catch (error) { console.error(error) }
    }

    useEffect(() => { fetchAll() }, [])

    return (
        <>
            <h1>Assignment Submission Scheduler</h1>
            <form onSubmit={handleSubmit}>
                <label>Due Date</label>
                <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
                <label>Allow Late Submission</label>
                <input name="allowLateSubmission" type="checkbox" checked={form.allowLateSubmission} onChange={handleChange} />
                <label>Linked Assignment ID</label>
                <input name="linkedAssignmentId" type="text" value={form.linkedAssignmentId} onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>

            <div>
                {allAssignments.map((item, ind) => (
                    <div key={ind}>
                        <p>{item._id}</p>
                        <p>{item.dueDate}</p>
                        <button onClick={() => handleView(item._id)}>View</button>
                        <button onClick={() => { setUpdateId(item._id); setUpdateForm({ dueDate: item.dueDate, submittedAt: item.submittedAt, submissionStatus: item.submissionStatus, feedback: item.feedback, allowLateSubmission: item.allowLateSubmission, linkedAssignmentId: item.linkedAssignmentId }) }}>Edit</button>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                ))}
            </div>

            {selectedAssignment && (
                <div>
                    <h2>Selected Assignment</h2>
                    <p>{selectedAssignment[0]?.dueDate}</p>
                    <p>{selectedAssignment[0]?.submissionStatus}</p>
                    <p>{selectedAssignment[0]?.feedback}</p>
                    <button onClick={() => setSelectedAssignment(null)}>Close</button>
                </div>
            )}

            {updateId && (
                <div>
                    <h2>Update Assignment</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <label>Due Date</label>
                        <input name="dueDate" type="date" value={updateForm.dueDate} onChange={handleChangeUpdate} />
                        <label>Submitted At</label>
                        <input name="submittedAt" type="date" value={updateForm.submittedAt} onChange={handleChangeUpdate} />
                        <label>Submission Status</label>
                        <input name="submissionStatus" type="text" value={updateForm.submissionStatus} onChange={handleChangeUpdate} />
                        <label>Feedback</label>
                        <input name="feedback" type="text" value={updateForm.feedback} onChange={handleChangeUpdate} />
                        <label>Allow Late Submission</label>
                        <input name="allowLateSubmission" type="checkbox" checked={updateForm.allowLateSubmission} onChange={handleChangeUpdate} />
                        <label>Linked Assignment ID</label>
                        <input name="linkedAssignmentId" type="text" value={updateForm.linkedAssignmentId} onChange={handleChangeUpdate} />
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setUpdateId(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </>
    )
}

// ─── Project Submission Scheduler ────────────────────────────────────────────

const ProjectSubmissionScheduler = () => {
    const [form, setForm] = useState({
        projectTitle: "", submissionDate: "", projectLink: "", phase: ""
    })
    const [updateForm, setUpdateForm] = useState({ ...form })
    const [allProjects, setAllProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [updateId, setUpdateId] = useState(null)
    const token = localStorage.getItem("token")

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleChangeUpdate = (e) => setUpdateForm({ ...updateForm, [e.target.name]: e.target.value })

    const fetchAll = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/project-submission`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            setAllProjects(data.data)
        } catch (error) { console.error(error) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/project-submission`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(form)
            })
            if (!res.ok) throw Error("Api call failed")
            fetchAll()
        } catch (error) { console.error(error) }
    }

    const handleView = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/project-submission/${id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw Error("Api call failed")
            const data = await res.json()
            setSelectedProject(data.data)
        } catch (error) { console.error(error) }
    }

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/project-submission/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            if (!res.ok) throw Error("Api call failed")
            fetchAll()
        } catch (error) { console.error(error) }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${BASE_URL}/api/scheduler/project-submission/${updateId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(updateForm)
            })
            if (!res.ok) throw Error("Api call failed")
            setUpdateId(null)
            fetchAll()
        } catch (error) { console.error(error) }
    }

    useEffect(() => { fetchAll() }, [])

    return (
        <>
            <h1>Project Submission Scheduler</h1>
            <form onSubmit={handleSubmit}>
                <label>Project Title</label>
                <input name="projectTitle" type="text" value={form.projectTitle} onChange={handleChange} required />
                <label>Submission Date</label>
                <input name="submissionDate" type="date" value={form.submissionDate} onChange={handleChange} required />
                <label>Project Link</label>
                <input name="projectLink" type="text" value={form.projectLink} onChange={handleChange} />
                <label>Phase</label>
                <input name="phase" type="text" value={form.phase} onChange={handleChange} />
                <button type="submit">Submit</button>
            </form>

            <div>
                {allProjects.map((item, ind) => (
                    <div key={ind}>
                        <p>{item._id}</p>
                        <p>{item.projectTitle}</p>
                        <button onClick={() => handleView(item._id)}>View</button>
                        <button onClick={() => { setUpdateId(item._id); setUpdateForm({ projectTitle: item.projectTitle, submissionDate: item.submissionDate, projectLink: item.projectLink, phase: item.phase }) }}>Edit</button>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                ))}
            </div>

            {selectedProject && (
                <div>
                    <h2>Selected Project</h2>
                    <p>{selectedProject[0]?.projectTitle}</p>
                    <p>{selectedProject[0]?.submissionDate}</p>
                    <p>{selectedProject[0]?.phase}</p>
                    <button onClick={() => setSelectedProject(null)}>Close</button>
                </div>
            )}

            {updateId && (
                <div>
                    <h2>Update Project</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <label>Project Title</label>
                        <input name="projectTitle" type="text" value={updateForm.projectTitle} onChange={handleChangeUpdate} />
                        <label>Submission Date</label>
                        <input name="submissionDate" type="date" value={updateForm.submissionDate} onChange={handleChangeUpdate} />
                        <label>Project Link</label>
                        <input name="projectLink" type="text" value={updateForm.projectLink} onChange={handleChangeUpdate} />
                        <label>Phase</label>
                        <input name="phase" type="text" value={updateForm.phase} onChange={handleChangeUpdate} />
                        <button type="submit">Update</button>
                        <button type="button" onClick={() => setUpdateId(null)}>Cancel</button>
                    </form>
                </div>
            )}
        </>
    )
}

// ─── Default Export ───────────────────────────────────────────────────────────

const EventScheduling = () => {
    return (
        <>
            <ExamScheduler />
            <AssignmentSubmissionScheduler />
            <ProjectSubmissionScheduler />
        </>
    )
}

export default EventScheduling;