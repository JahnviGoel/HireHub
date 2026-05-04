import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function CreateJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/jobs", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Job Created Successfully 🚀");

      // Clear form
      setForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });

      // Optional redirect
      navigate("/admin");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Navbar */}
      <div className="bg-blue-700 text-white p-4 text-xl font-bold">
        Create Job
      </div>

      {/* Form */}
      <div className="flex justify-center items-center flex-1">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">

          <h2 className="text-2xl font-semibold mb-6">
            Post a New Job 💼
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={form.title}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />

            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={form.company}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              required
            />

            <input
              type="text"
              name="salary"
              placeholder="Salary"
              value={form.salary}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
            />

            <textarea
              name="description"
              placeholder="Job Description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-md"
              rows="4"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-md hover:bg-blue-800"
            >
              {loading ? "Posting..." : "Post Job"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default CreateJob;