import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function EditJob() {

  const { id } = useParams(); // jobId from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: ""
  });

  const token = localStorage.getItem("token");

  // ✅ (Optional) Fetch job details to pre-fill form
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/admin/jobs", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const job = res.data.find(j => j._id === id);

        if (job) {
          setFormData({
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            description: job.description
          });
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, [id, token]);

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ UPDATE API CALL HERE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/jobs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Job updated successfully ✅");

      navigate("/admin/jobs");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed ❌");
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">Edit Job</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2"
        >
          Update Job
        </button>

      </form>

    </div>
  );
}

export default EditJob;