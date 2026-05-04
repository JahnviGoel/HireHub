import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const storedUser = localStorage.getItem("user");

const user = storedUser && storedUser !== "undefined"
  ? JSON.parse(storedUser)
  : {};

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between items-center">

      {/* Left Side (Logo) */}
      <h1
        onClick={() => navigate("/jobs")}
        className="text-xl font-bold text-blue-700 cursor-pointer"
      >
        HireHub
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        <span className="text-gray-700 font-medium">
          {user?.name}
        </span>

        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;