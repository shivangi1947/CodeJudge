import React from "react";
import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="bg-purple-800 text-white px-6 py-3 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">CodeJudge</Link>
      </div>
      <div className="space-x-6 text-sm font-medium">
        <Link to="/problems" className="hover:text-purple-200">
          Problems
        </Link>
        <Link to="/login" className="hover:text-purple-200">
          Login
        </Link>
        <Link to="/signup" className="hover:text-purple-200">
          Sign Up
        </Link>
              <Link to="/logout" className="text-white hover:text-yellow-300 px-3 py-2 rounded">
         Logout
      </Link>

      </div>
    </nav>
  );
};

export default Navbar;
