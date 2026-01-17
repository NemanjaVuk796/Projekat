import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  AuthErrorCodes
} from "firebase/auth";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === AuthErrorCodes.INVALID_PASSWORD) {
        setError("Wrong password. Try again.");
      } else {
        setError(`Error: ${err.message}`);
      }
    }
  };

  const handleSignup = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  return (
    <div id="login">
      <h1>Firebase Login</h1>
      {error && <div className="errorlabel">{error}</div>}
      <div className="group">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Email</label>
      </div>
      <div className="group">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Password</label>
      </div>
      <button className="button buttonBlue" onClick={handleLogin}>
        Log in
      </button>
      <button className="button buttonBlue" onClick={handleSignup}>
        Sign up
      </button>
    </div>
  );
}