import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f3f2ef] p-6">

        {/* Welcome Section */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your profile, explore jobs, and track your applications.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Jobs Card */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">
              Find Jobs
            </h2>
            <p className="text-gray-600 mb-4">
              Explore available jobs and apply.
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              View Jobs
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2 text-green-600">
              My Profile
            </h2>
            <p className="text-gray-600 mb-4">
              Update your details and resume.
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Profile
            </button>
          </div>

          {/* Applications Card */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-lg font-semibold mb-2 text-purple-600">
              My Applications
            </h2>
            <p className="text-gray-600 mb-4">
              Track your job applications & status.
            </p>
            <button
              onClick={() => navigate("/my-applications")}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              View Applications
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;