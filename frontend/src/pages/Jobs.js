import React, { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs] = useState([]);
  const navigate = useNavigate();
  // 🔹 Fetch Jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load jobs");
      }
    };

    fetchJobs();
  }, []);

  // 🔹 Apply Job
  const handleApply = async (jobId) => {
  try {
    await API.post(`/apply/${jobId}`);

    alert("Applied Successfully ✅");

    navigate("/my-applications"); // ✅ redirect

  } catch (err) {
    if (err.response?.status === 400) {
      alert("You already applied ❗");

      // ✅ STILL REDIRECT
      navigate("/my-applications");
    } else {
      alert("Error ❌");
    }
  }
};

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f3f2ef] p-6">

        <h1 className="text-2xl font-bold mb-6">
          Find Your Dream Job 💼
        </h1>

        <div className="space-y-4 max-w-3xl mx-auto">
          {jobs.length === 0 ? (
            <p>No jobs available</p>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
              >
                {/* Job Title */}
                <h2 className="text-xl font-semibold text-blue-700">
                  {job.title}
                </h2>

                {/* Company + Location */}
                <p className="text-gray-600">
                  {job.company} • {job.location || "Remote"}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-500 mt-2">
                  {job.description}
                </p>

                {/* Apply Button */}
                <button
                  onClick={() => handleApply(job._id)}
                  disabled={appliedJobs.includes(job._id)}
                  className={`mt-4 px-4 py-2 rounded text-white transition ${
                    appliedJobs.includes(job._id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-700 hover:bg-blue-800"
                  }`}
                >
                  {appliedJobs.includes(job._id)
                    ? "Applied"
                    : "Apply Now"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Jobs;
