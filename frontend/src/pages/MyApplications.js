import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/my-applications");
        setApplications(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load applications");
      }
    };

    fetchApplications();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f3f2ef] p-6">
        <h1 className="text-2xl font-bold mb-6">
          My Applications 📄
        </h1>

        <div className="space-y-4 max-w-3xl mx-auto">
          {applications.length === 0 ? (
            <p>No applications yet</p>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="bg-white p-5 rounded-xl shadow"
              >
                {/* Job Info */}
                <h2 className="text-xl font-semibold text-blue-700">
                  {app.job?.title}
                </h2>

                <p className="text-gray-600">
                  {app.job?.company} • {app.job?.location}
                </p>

                {/* Application Status */}
                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      app.status === "accepted"
                        ? "text-green-600"
                        : app.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </p>

                {/* Pending Message */}
                {app.status === "pending" && (
                  <p className="text-yellow-600 mt-1">
                    Waiting for admin approval ⏳
                  </p>
                )}

                {/* Quiz Button */}
                {app.status === "accepted" && !app.score && (
                  <button
                    onClick={() => navigate(`/quiz/${app.job._id}`)}
                    className="mt-3 bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Give Quiz
                  </button>
                )}

                {/* Quiz Status */}
                {app.score && (
                  <p className="text-blue-600 mt-1">
                    Score: {app.score} | {app.passed ? "Passed ✅" : "Failed ❌"}
                  </p>
                )}

                {/* Interview Stage */}
                {app.passed && (!app.finalStatus || app.finalStatus === "pending") && (
  <p className="text-purple-600 mt-1">
    Waiting for Interview Call 📧
  </p>
)}



                {/* Final Result */}
                {app.finalStatus && app.finalStatus !== "pending" && (
                  <p className="mt-2 font-semibold">
                    Final Result:{" "}
                    <span
                      className={
                        app.finalStatus === "selected"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {app.finalStatus}
                    </span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default MyApplications;