import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("userToken", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const googleAuth = async () => {
    try {
      // Trigger Google authentication
      window.location.href = "http://localhost:8080/auth/google";
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div
      style={{
        marginTop: "30vh",
        marginLeft: "8vh",
        flexDirection: "column",
        width: "100vh",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        border: "1px solid #ccc",
        marginBottom: "1rem",
        padding: "1rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        >
        <input
          name="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
        />
        <button type="submit">Login with email</button>
        <hr />
        <button type="button" onClick={googleAuth}>
          Login with Google
        </button>
      </form>
    </div>
  );
}

export default Login;
