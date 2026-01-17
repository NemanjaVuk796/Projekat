import { useNavigate } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Applikacija za deljenje slika</h1>
      <div className="card">
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    </div>
  );
}