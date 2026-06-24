import React from "react";
import ErrorPage, { RouteErrorPage } from "./errors/components/ErrorPage.jsx";
import { ERROR_TYPES } from "./errors/config/errorConfig.js";
import useUser from "../src/ContextApi/useUser.js";

import "../src/index.css";
import "./pages/styles/global.css";
import { Routes, Route, useLocation } from "react-router-dom";
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
import ToDoList from "./pages/ToDoList.jsx";
import ExamSchedule from "./pages/ExamSchedule.jsx";
import ProjectSubmissionScheduler from "./pages/Projectsubmissionscheduler.jsx";
import Assignments from "./pages/Assignments.jsx";
import SearchResults from "./pages/Searchresults.jsx";
import ComingSoon from "./components/ComingSoon/Index.jsx";
import Payment from "./pages/Payment.jsx";

const App = () => {
  const { user } = useUser();
  const hideNavOn = ["/login", "/register"];
  const location = useLocation();
  const showNavbar = user && !hideNavOn.includes(location.pathname);

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
        <Route
          path="/upgrade"
          element={<Payment />}
        />

        <Route
          element={<ProtectedRoute component={<AppShell />} />}
          errorElement={<RouteErrorPage />}
        >
          <Route path='/dashboard' element={<ProtectedRoute component={<Dashboard/>}/>} />

          <Route path="/notes" element={<ProtectedRoute component={<Notes />} />} />
          <Route path="/notes/new" element={<ProtectedRoute component={<Notes />} />} />
          <Route path="/notes/:id" element={<ProtectedRoute component={<Notes />} />} />
          <Route path="/notes/:id/edit" element={<ProtectedRoute component={<Notes />} />} />
          
          <Route
            path="/quiz"
            element={<ProtectedRoute component={<Quiz />} />}
          />
          <Route
            path="/quiz/create"
            element={<ProtectedRoute component={<Quiz />} />}
          />
          <Route
            path="/quiz/upload"
            element={<ProtectedRoute component={<Quiz />} />}
          />
          <Route
            path="/quiz/text"
            element={<ProtectedRoute component={<Quiz />} />}
          />
          <Route
            path="/quiz/types"
            element={<ProtectedRoute component={<Quiz />} />}
          />
          <Route
            path="/quiz/take/:id"
            element={<ProtectedRoute component={<Quiz />} />}
          />
          <Route
            path="/quiz/results/:id"
            element={<ProtectedRoute component={<Quiz />} />}
          />
          <Route
            path="/quiz/history"
            element={<ProtectedRoute component={<Quiz />} />}
          />
          <Route
            path="/flashcards"
            element={<ProtectedRoute component={<Flashcards />} />}
          />
          <Route
            path="/flashcards/viewer/:id"
            element={<ProtectedRoute component={<Flashcards />} />}
          />
          <Route
            path="/flashcards/create"
            element={<ProtectedRoute component={<Flashcards />} />}
          />
          <Route
            path="/flashcards/create/topic"
            element={<ProtectedRoute component={<Flashcards />} />}
          />
          <Route
            path="/flashcards/create/scratch"
            element={<ProtectedRoute component={<Flashcards />} />}
          />
          <Route
            path="/flashcards/create/pdf"
            element={<ProtectedRoute component={<Flashcards />} />}
          />

          <Route
            path="/tutor"
            element={
              <ProtectedRoute
                component={
                  <ComingSoon
                    label="Tutor Chat"
                    eta="July 2026"
                  >
                    <Tutor />
                  </ComingSoon>
                }
              />
            }
          />
          <Route
            path="/study-room"
            element={
              <ProtectedRoute
                component={
                  <ComingSoon
                    label="Your Collaboraive Study Room"
                    eta="August 2026"
                  >
                    <StudyRoom />
                  </ComingSoon>
                }
              />
            }
          />
          <Route
            path="/study-room/:roomId"
            element={
              <ProtectedRoute
                component={
                  <ComingSoon
                    label="Room Chat"
                    eta="July 2026"
                  >
                    <RoomChat />
                  </ComingSoon>
                }
              />
            }
          />
          <Route
            path="/image-analyzer"
            element={
              <ProtectedRoute
                component={
                  <ComingSoon
                    label="Image Analysis"
                    eta="July 2026"
                  >
                    <ImageAnalysis />
                  </ComingSoon>
                }
              />
            }
          />
          <Route
            path="/pdf-summary"
            element={
              <ProtectedRoute
                component={
                  <ComingSoon
                    label="Pdf Analysis"
                    eta="July 2026"
                  >
                    <PDFSummary />
                  </ComingSoon>
                }
              />
            }
          />
          <Route
            path="/scheduler"
            element={
              <ProtectedRoute
                component={
                  <ComingSoon
                    label="Event Schedule"
                    eta="July 2025"
                  >
                    <Scheduler />
                  </ComingSoon>
                }
              />
            }
          />

          <Route
            path="/time-table"
            element={<ProtectedRoute component={<TimeTable />} />}
          />
          <Route
            path="/time-table/:view"
            element={<ProtectedRoute component={<TimeTable />} />}
          />
          <Route
            path="/time-table/:view/event/:id"
            element={<ProtectedRoute component={<TimeTable />} />}
          />
          <Route
            path="/time-table/:view/create"
            element={<ProtectedRoute component={<TimeTable />} />}
          />
          <Route
            path="/time-table/:view/edit/:id"
            element={<ProtectedRoute component={<TimeTable />} />}
          />

          <Route
            path="/event-scheduling"
            element={
              <ProtectedRoute
                component={
                  <ComingSoon
                    label="Event Scheduling"
                    eta="July 2026"
                  >
                    <EventScheduling />
                  </ComingSoon>
                }
              />
            }
          />
          <Route
            path="/scheduler/generate-plan"
            element={
              <ProtectedRoute
                component={
                  <ComingSoon
                    label="AI Generated Study Plan"
                    eta="July 2026"
                  >
                    <GeneratePlanView />
                  </ComingSoon>
                }
              />
            }
          />
          <Route
            path="/notebook"
            element={<ProtectedRoute component={<Notebook />} />}
          />
          <Route
            path="/notebook/:id"
            element={<ProtectedRoute component={<Notebook />} />}
          />
          <Route
            path="/event-scheduling/exams"
            element={<ProtectedRoute component={
              <ComingSoon
                label="Exam Sxhedule"
                eta="July 2026"
              >

                <ExamSchedule />
              </ComingSoon>
            } />}
          />
          <Route
            path="/event-scheduling/projects"
            element={
              <ProtectedRoute component={
                <ComingSoon
                  label="Project Scheduler"
                  eta="July 2026"
                >

                  <ProjectSubmissionScheduler />
                </ComingSoon>
              } />
            }
          />
          <Route
            path="/event-scheduling/assignments"
            element={<ProtectedRoute component={<Assignments />} />}
          />
          <Route
            path="/event-scheduling/assignments/new"
            element={<ProtectedRoute component={<Assignments />} />}
          />
          <Route
            path="/event-scheduling/assignments/:id/edit"
            element={<ProtectedRoute component={<Assignments />} />}
          />

          <Route
            path="/search"
            element={<ProtectedRoute component={<SearchResults />} />}
          />
          <Route
            path="/search/:tab"
            element={<ProtectedRoute component={<SearchResults />} />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
