import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function QuizManagement() {

  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
      }
    };

    fetchJobs();
  }, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">Quiz Management</h2>

      {jobs.map(job => (
        <div
          key={job._id}
          onClick={() => navigate(`/admin/quiz/${job._id}`)}
          className="bg-white p-5 mb-4 shadow rounded cursor-pointer hover:bg-gray-100"
        >
          <h3 className="font-bold">{job.title}</h3>
          <p>{job.company}</p>
        </div>
      ))}

      

    </div>
  );
}

export default QuizManagement;