// src/components/auth/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Import the separate CSS file

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  }); //initial form state hai

  const [error, setError] = useState(""); //initial error 

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }; //form ka data set ke liye

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try 
    {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, formData);//is path ko data bhej do
      localStorage.setItem("token", res.data.token); 
      localStorage.setItem("userId", res.data.userId);
      navigate("/");//home pe navigate kar jao
    }
    catch (err) 
    {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Sign Up</h2>

        {error && <div className="signup-error">{error}</div>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="signup-input"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="signup-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="signup-input"
        />

        <button type="submit" className="signup-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default Signup;
