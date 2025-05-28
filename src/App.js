import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/login';
import Register from './Components/Register';
import Home from './Components/Home';
import Navbar from "./Components/Navbar";
import Groups from "./Components/Groups";
import Profile from "./Components/Profile";
import MyExpense from "./Components/MyExpense";
import GroupView from "./Components/GroupView";
import JoinGroup from "./Components/JoinGroup";


function App() {

   const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000; // ms
      const timeout = setTimeout(() => {
        localStorage.removeItem("userToken");
        navigate("/dashboard");
      }, exp - Date.now());

      return () => clearTimeout(timeout);
    }
  }, [navigate]);


  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/join" element={<JoinGroup />} />
        <Route path="/group/:groupId" element={<GroupView />} />
        <Route path="/myexpense" element={<MyExpense />} />
      </Routes>
      </>
  );
}

export default App;