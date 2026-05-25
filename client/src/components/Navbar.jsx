import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav>
      <div>
        <Link to="/dashboard">Spark.E</Link>
      </div>

      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/notes">Notes</Link>
        </li>
        <li>
          <Link to="/tutor">Tutor</Link>
        </li>
        <li>
          <Link to="/quiz">Quiz</Link>
        </li>
        {/* <li><Link to="/flashcards">Flashcards</Link></li> */}
        <li>
          <Link to="/study-room">Study Rooms</Link>
        </li>
        <li>
          <Link to="/scheduler">Scheduler</Link>
        </li>
        <li>
          <Link to="/image-analysis">Image Analytics</Link>
        </li>
        <li>
          <Link to="/image-analysis">Image Analytics</Link>
        </li>
        <li>
          <Link to="/pdf-analysis">Pdf Analytics</Link>
        </li>
      </ul>

      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
