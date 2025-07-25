// src/components/auth/Logout.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Call your backend logout endpoint
        await axios.post("/api/auth/logout");

        // Clear frontend storage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        // Redirect to login
        navigate("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-700">Logging you out...</p>
    </div>
  );
};

export default Logout;
