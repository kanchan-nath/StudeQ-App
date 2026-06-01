import React, { useEffect, useState } from "react";
import BASE_URL from "../lib/api.js";
const Scheduler = () => {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    schedulerDate: "",
    duration: "",
    completed: false,
  });
  const [loading, setLoading] = useState(false);
  const [formResult, setFormResult] = useState([]);
  const [formDataResult, setFormDataResult] = useState({});
  const [isGenerate_AI_Study_Plan, setIsGenerate_AI_Study_Plan] =
    useState(false);

  const [studyPlanData, setStudyPlanData] = useState({
    subjects: "",
    hoursPerDay: "",
    goalDate: "",
  });

  const [timeTableForm, setTimeTableForm] = useState({
    title: "",
    topic: "",
    startTime: "",
    endTime: "",
    plannedDuration: "",
    isRecurring: "",
    recurrencePattern: "",
    recurrenceDays: "",
    recurrenceEndDate: "",
    status: "",
    actualDuration: "",
    goalDescription: "",
    eminderEnabled: "",
    reminderMinutesBefore: "",

  })

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("data:");

    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/scheduler`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setFormDataResult(data.data);

      setFormData("");
    } catch (error) {
      throw new Error(`Scheduler creation problem ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/scheduler`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setFormResult(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickCompletedButton = async (e, schedulerId) => {
    try {
      setFormData({ ...formData, [e.target.name]: true });
      console.log(schedulerId);

      const res = await fetch(`${BASE_URL}/api/scheduler/${schedulerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlebuttonGenerativeAI = async (e) => {
    e.preventDefault();
    setIsGenerate_AI_Study_Plan(true);

    try {
      const res = await fetch(`${BASE_URL}/api/scheduler/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studyPlanData),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerate_AI_Study_Plan(false);
    }
  };

  const handleTimeTableSubmit = async (e) => {
    e.preventDefault()
    
  }

  const handleChangeTimeTable = async (e) => {
    setTimeTableForm({ ...timeTableForm, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    fetchData();
  }, [formDataResult]);

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="subject">Subject: </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <label htmlFor="topic">Topic: </label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />

          <label htmlFor="date">Date: </label>
          <input
            type="date"
            name="schedulerDate"
            value={formData.schedulerDate}
            onChange={handleChange}
            required
          />

          <label htmlFor="duration">Duration: </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <button disabled={loading}>Create Scheduler</button>
        </form>
      </div>

      <div>
        {formResult.map((item, index) => (
          <div key={index}>
            <p>Subject: {item.subject} </p>
            <p>Topic: {item.topic}</p>
            <p>Date: {new Date(item.schedulerDate).toLocaleDateString()}</p>
            <p>Duration: {item.duration}</p>
            <p>
              Completed:{" "}
              <button
                name="completed"
                onClick={(e) => handleClickCompletedButton(e, item._id)}
              >
                Done
              </button>
            </p>
          </div>
        ))}
      </div>

      <div>
        {!isGenerate_AI_Study_Plan ? (
          <button onClick={() => setIsGenerate_AI_Study_Plan(true)}>
            Generate AI Study Plan
          </button>
        ) : (
          <form onSubmit={handlebuttonGenerativeAI}>
            <label htmlFor="subjects">Subjects: </label>
            <input
              type="text"
              name="subjects"
              required
              onChange={handleChangeStudyPlan}
            />

            <label htmlFor="hoursPerDay">Hours Per Day: </label>
            <input
              type="number"
              name="hoursPerDay"
              required
              onChange={handleChangeStudyPlan}
            />

            <label htmlFor="goalDate">Goal Date : </label>
            <input
              type="text"
              name="goalDate"
              required
              onChange={handleChangeStudyPlan}
            />
          </form>
        )}
      </div>

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

          <label htmlFor="title">isRecurring</label>
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
          />
          <button>Submit</button>
        </form>
      </div>
    </>
  );
};

export default Scheduler;
