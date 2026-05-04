import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function AdminApplications() {

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/admin/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(res.data);

        // 🔥 fetch applicant stats for each job
        res.data.forEach(async (job) => {
          try {
            const appRes = await API.get(`/applicants/${job._id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const apps = appRes.data;

            const total = apps.length;
            const accepted = apps.filter(a => a.status === "accepted").length;
            const rejected = apps.filter(a => a.status === "rejected").length;
            const pending = total - accepted - rejected;

            setStats(prev => ({
              ...prev,
              [job._id]: { total, accepted, rejected, pending }
            }));

          } catch (err) {
            console.error(err);
          }
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">Applications Overview</h2>

      {jobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        jobs.map((job) => {
          const stat = stats[job._id] || {};

          return (
            <div
              key={job._id}
              onClick={() => navigate(`/admin/applicants/${job._id}`)}
              className="bg-white p-5 mb-5 shadow rounded cursor-pointer hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>

              {/* 📊 Stats */}
              <div className="flex gap-4 mt-4 flex-wrap">

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded">
                  Total: {stat.total || 0}
                </span>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
                  Accepted: {stat.accepted || 0}
                </span>

                <span className="bg-red-100 text-red-700 px-3 py-1 rounded">
                  Rejected: {stat.rejected || 0}
                </span>

                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded">
                  Pending: {stat.pending || 0}
                </span>

              </div>

              <p className="text-gray-400 mt-2">
                Click to view applicants →
              </p>

              
            </div>
            
          );
        })
      )}

    </div>
  );
}

export default AdminApplications;