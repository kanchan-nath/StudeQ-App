import React, { lazy, Suspense, useEffect } from "react";
import ErrorPage, { RouteErrorPage } from "./errors/components/ErrorPage.jsx";
import { ERROR_TYPES } from "./errors/config/errorConfig.js";
import useUser from "../src/ContextApi/useUser.js";
import useLoader from "./ContextApi/useLoader.js";

// Bridge: Suspense fallback can't call hooks directly, so delegate to component
const SuspenseLoader = () => {
  const { show, hide } = useLoader();
  useEffect(() => {
    show("Loading...");
    return () => hide();
  }, []);
  return null; // GlobalLoader renders via LoaderProvider portal
};

import "../src/index.css";
import "./pages/styles/global.css";
import { Routes, Route, useLocation } from "react-router-dom";

// Eager (needed immediately / layout-level)
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicLayout from "./components/layouts/PublicLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import AppShell from "./components/layouts/AppShell.jsx";
import ComingSoon from "./components/ComingSoon/Index.jsx";
import MissionPage from "./pages/Missionpage.jsx";

// Lazy pages
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Notes = lazy(() => import("./pages/Notes.jsx"));
const Quiz = lazy(() => import("./pages/Quiz.jsx"));
const Tutor = lazy(() => import("./pages/Tutor.jsx"));
const StudyRoom = lazy(() => import("./pages/StudyRoom.jsx"));
const RoomChat = lazy(() => import("./pages/RoomChat.jsx"));
const ImageAnalysis = lazy(() => import("./pages/ImageAnalysis.jsx"));
const PDFSummary = lazy(() => import("./pages/PDFSummary.jsx"));
const Scheduler = lazy(() => import("./pages/Scheduler.jsx"));
const GeneratePlanView = lazy(() => import("./pages/GeneratePlanView.jsx"));
const Flashcards = lazy(() => import("./pages/Flashcards.jsx"));
const Notebook = lazy(() => import("./pages/Notebook.jsx"));
const TimeTable = lazy(() => import("./pages/TimeTable.jsx"));
const EventScheduling = lazy(() => import("./pages/EventScheduling.jsx"));
const ToDoList = lazy(() => import("./pages/ToDoList.jsx"));
const ExamSchedule = lazy(() => import("./pages/ExamSchedule.jsx"));
const ProjectSubmissionScheduler = lazy(() => import("./pages/Projectsubmissionscheduler.jsx"));
const Assignments = lazy(() => import("./pages/Assignments.jsx"));
const SearchResults = lazy(() => import("./pages/Searchresults.jsx"));
const Payment = lazy(() => import("./pages/Payment.jsx"));

const App = () => {
  const { user } = useUser();
  const hideNavOn = ["/login", "/register"];
  const location = useLocation();
  const showNavbar = user && !hideNavOn.includes(location.pathname);

  return (
    <>
      {/* {showNavbar && <Navbar/>} */}
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route
            element={<ProtectedRoute component={<AppShell />} />}
            errorElement={<RouteErrorPage />}
          >
            <Route path="/dashboard" element={<ProtectedRoute component={<Dashboard />} />} />
            <Route path="/upgrade" element={<Payment />} />

            <Route path="/notes" element={<ProtectedRoute component={<Notes />} />} />
            <Route path="/notes/new" element={<ProtectedRoute component={<Notes />} />} />
            <Route path="/notes/:id" element={<ProtectedRoute component={<Notes />} />} />
            <Route path="/notes/:id/edit" element={<ProtectedRoute component={<Notes />} />} />

            <Route path="/quiz" element={<ProtectedRoute component={<Quiz />} />} />
            <Route path="/quiz/create" element={<ProtectedRoute component={<Quiz />} />} />
            <Route path="/quiz/upload" element={<ProtectedRoute component={<Quiz />} />} />
            <Route path="/quiz/text" element={<ProtectedRoute component={<Quiz />} />} />
            <Route path="/quiz/types" element={<ProtectedRoute component={<Quiz />} />} />
            <Route path="/quiz/take/:id" element={<ProtectedRoute component={<Quiz />} />} />
            <Route path="/quiz/results/:id" element={<ProtectedRoute component={<Quiz />} />} />
            <Route path="/quiz/history" element={<ProtectedRoute component={<Quiz />} />} />

            <Route path="/flashcards" element={<ProtectedRoute component={<Flashcards />} />} />
            <Route path="/flashcards/viewer/:id" element={<ProtectedRoute component={<Flashcards />} />} />
            <Route path="/flashcards/create" element={<ProtectedRoute component={<Flashcards />} />} />
            <Route path="/flashcards/create/topic" element={<ProtectedRoute component={<Flashcards />} />} />
            <Route path="/flashcards/create/scratch" element={<ProtectedRoute component={<Flashcards />} />} />
            <Route path="/flashcards/create/pdf" element={<ProtectedRoute component={<Flashcards />} />} />

            <Route path="/tutor" element={<ProtectedRoute component={<ComingSoon label="Tutor Chat" eta="July 2026"><Tutor /></ComingSoon>} />} />
            <Route path="/study-room" element={<ProtectedRoute component={<ComingSoon label="Your Collaboraive Study Room" eta="August 2026"><StudyRoom /></ComingSoon>} />} />
            <Route path="/study-room/:roomId" element={<ProtectedRoute component={<ComingSoon label="Room Chat" eta="July 2026"><RoomChat /></ComingSoon>} />} />
            <Route path="/image-analyzer" element={<ProtectedRoute component={<ComingSoon label="Image Analysis" eta="July 2026"><ImageAnalysis /></ComingSoon>} />} />
            <Route path="/pdf-summary" element={<ProtectedRoute component={<ComingSoon label="Pdf Analysis" eta="July 2026"><PDFSummary /></ComingSoon>} />} />
            <Route path="/scheduler" element={<ProtectedRoute component={<ComingSoon label="Event Schedule" eta="July 2025"><Scheduler /></ComingSoon>} />} />

            <Route path="/time-table" element={<ProtectedRoute component={<TimeTable />} />} />
            <Route path="/time-table/:view" element={<ProtectedRoute component={<TimeTable />} />} />
            <Route path="/time-table/:view/event/:id" element={<ProtectedRoute component={<TimeTable />} />} />
            <Route path="/time-table/:view/create" element={<ProtectedRoute component={<TimeTable />} />} />
            <Route path="/time-table/:view/edit/:id" element={<ProtectedRoute component={<TimeTable />} />} />

            <Route path="/event-scheduling" element={<ProtectedRoute component={<ComingSoon label="Event Scheduling" eta="July 2026"><EventScheduling /></ComingSoon>} />} />
            <Route path="/scheduler/generate-plan" element={<ProtectedRoute component={<ComingSoon label="AI Generated Study Plan" eta="July 2026"><GeneratePlanView /></ComingSoon>} />} />

            <Route path="/notebook" element={<ProtectedRoute component={<Notebook />} />} />
            <Route path="/notebook/:id" element={<ProtectedRoute component={<Notebook />} />} />

            <Route path="/event-scheduling/exams" element={<ProtectedRoute component={<ComingSoon label="Exam Sxhedule" eta="July 2026"><ExamSchedule /></ComingSoon>} />} />
            <Route path="/event-scheduling/projects" element={<ProtectedRoute component={<ComingSoon label="Project Scheduler" eta="July 2026"><ProjectSubmissionScheduler /></ComingSoon>} />} />

            <Route path="/event-scheduling/assignments" element={<ProtectedRoute component={<Assignments />} />} />
            <Route path="/event-scheduling/assignments/new" element={<ProtectedRoute component={<Assignments />} />} />
            <Route path="/event-scheduling/assignments/:id/edit" element={<ProtectedRoute component={<Assignments />} />} />

            <Route path="/search" element={<ProtectedRoute component={<SearchResults />} />} />
            <Route path="/search/:tab" element={<ProtectedRoute component={<SearchResults />} />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;