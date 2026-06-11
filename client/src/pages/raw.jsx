import React from "react";
import "../src/index.css"
import "./pages/styles/global.css";
import { Routes, Route } from "react-router-dom";
import Quiz from "./pages/Quiz.jsx";
import Flashcards from "./Flashcards.jsx";
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
                        path="/event-scheduling/assignments"
                        element={<ProtectedRoute component={<Assignments />} />}
                    />
                </Route>

            </Routes>
        </>
    );
};

export default App;
