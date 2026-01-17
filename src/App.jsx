import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Login from "./Login";
import Dashboard from "./Dashboard";
import AddForm from "./AddForm";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div>

      </div>
      <h1>Applikacija za deljenje slika</h1>
      <div className="card">
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
      <p className="read-the-docs"></p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/form" element={<AddForm />} />
      </Routes>
    </Router>
  );
}
