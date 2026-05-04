import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Fetch ONLY admin jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/admin/jobs", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setJobs(res.data);

      } catch (err) {
        console.error(err);
        alert("Failed to load jobs ❌");
      }
    };

    fetchJobs();
  }, [token]);

  // ✅ DELETE job (only own jobs allowed by backend)
  const handleDelete = async (id) => {
    try {
      await API.delete(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Job deleted ✅");

      // update UI without reload
      setJobs(jobs.filter(job => job._id !== id));

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed ❌");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">

      <h2 className="text-2xl font-bold mb-6">Manage Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs found</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-4 mb-4 shadow rounded"
          >

            <h3 className="text-lg font-bold">{job.title}</h3>
            <p className="text-gray-700">{job.company}</p>
            <p className="text-gray-500">{job.location}</p>

            <div className="mt-3 space-x-3">

              {/* ✅ Edit */}
              <button
                onClick={() => navigate(`/admin/edit-job/${job._id}`)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              {/* ✅ Delete */}
              <button
                onClick={() => handleDelete(job._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            
            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default ManageJobs;

