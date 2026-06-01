import React from "react";
import "./pages/styles/global.css";
import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Notes from "./pages/Notes.jsx";
import Quiz from "./pages/Quiz.jsx";
import Tutor from "./pages/Tutor.jsx";
import StudyRoom from "./pages/StudyRoom.jsx";
import RoomChat from "./pages/RoomChat.jsx";
import ImageAnalysis from "./pages/ImageAnalysis.jsx";
import PDFSummary from "./pages/PDFSummary.jsx";
import Scheduler from "./pages/Scheduler.jsx";
import GeneratePlanView from "./pages/GeneratePlanView.jsx";
import Navbar from "../src/components/Navbar.jsx";
import AppShell from "./components/layouts/AppShell.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import Notebook from "./pages/Notebook.jsx";
import TimeTable from "./pages/TimeTable.jsx";
import EventScheduling from "./pages/EventScheduling.jsx";

const App = () => {
  const token = localStorage.getItem("token");

  const hideNavOn = ["/login", "/register"];
  const showNavbar = token && !hideNavOn.includes(location.pathname);
  return (
    <>
      {/* {showNavbar && <Navbar/>} */}
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<AppShell />}>
          {/* <Route path='/dashboard' element={<ProtectedRoute component={<Dashboard/>}/>} /> */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/notes"
            element={<ProtectedRoute component={<Notes />} />}
          />
          <Route
            path="/quiz"
            element={<ProtectedRoute component={<Quiz />} />}
          />
          <Route
            path="/flashcards"
            element={<ProtectedRoute component={<Flashcards />} />}
          />
          <Route
            path="/tutor"
            element={<ProtectedRoute component={<Tutor />} />}
          />
          <Route
            path="/study-room"
            element={<ProtectedRoute component={<StudyRoom />} />}
          />
          <Route
            path="/study-room/:roomId"
            element={<ProtectedRoute component={<RoomChat />} />}
          />
          <Route
            path="/image-analysis"
            element={<ProtectedRoute component={<ImageAnalysis />} />}
          />
          <Route
            path="/pdf-analysis"
            element={<ProtectedRoute component={<PDFSummary />} />}
          />
          <Route
            path="/scheduler"
            element={<ProtectedRoute component={<Scheduler />} />}
          />

          <Route
            path="/time-table"
            element={<ProtectedRoute component={<TimeTable />} />}
          />
          <Route
            path="/event-scheduling"
            element={<ProtectedRoute component={<EventScheduling />} />}
          />
          <Route
            path="/scheduler/generate-plan"
            element={<ProtectedRoute component={<GeneratePlanView />} />}
          />
          <Route
            path="/notebook"
            element={<ProtectedRoute component={<Notebook />} />}
          />
          <Route
            path="/notebook/:chatId"
            element={<ProtectedRoute component={<Notebook />} />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
