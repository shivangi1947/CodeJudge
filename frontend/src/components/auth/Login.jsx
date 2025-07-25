// src/components/auth/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try 
{
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, formData);
    
    const token = res.data.token;
    const userId = res.data.userId; 

      localStorage.setItem("token", res.data.token); 
      localStorage.setItem("userId", res.data.userId);

    console.log("User ID:", userId); 

    navigate("/"); // redirect to home
  } 
  catch (err) 
  {
    console.log(err);
    setError(err.response?.data?.message || "Invalid credentials");
  }
};


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        {error && <div className="login-error">{error}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="login-input"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="login-input"
        />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
