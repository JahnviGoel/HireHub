import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function HireCandidates() {

  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await API.get("/admin/jobs", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setJobs(res.data);
    };

    fetchJobs();
  }, [token]);

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">Hire Candidates</h2>

      {jobs.map(job => (
        <div
          key={job._id}
          onClick={() => navigate(`/admin/hire/${job._id}`)}
          className="bg-white p-4 mb-3 shadow cursor-pointer"
        >
          <h3>{job.title}</h3>
          <p>{job.company}</p>
        </div>
      ))}

    </div>
  );
}

export default HireCandidates;