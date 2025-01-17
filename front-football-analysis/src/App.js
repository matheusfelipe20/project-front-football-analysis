import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import TeamPage from "./pages/football/TeamPage/TeamPage";
import FootballHome from "./pages/football/HomePage/FootballHome";
import Login from "./pages/football/LoginPage/Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("authToken"));

  return (
    <Router basename="/project-front-football-analysis">
      <MainContent token={token} setToken={setToken} />
    </Router>
  );
}

function MainContent({ token, setToken }) {
  return (
    <div className="App">
      <Header token={token} setToken={setToken} />
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/football" element={<FootballHome />} />
        <Route path="/football/team/:teamId" element={<TeamPage />} />
      </Routes>
    </div>
  );
}

export default App;