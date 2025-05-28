import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", form);
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
      />
      <input
        name="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
      />
      <input
        name="phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Phone"
      />
      <input
        name="password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
