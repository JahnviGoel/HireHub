import React, { useEffect, useState } from "react";
import API from "../api/axios";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    education: "",
    skills: "",
    experience: "",
  });

  const [resume, setResume] = useState(null);

  // 🔹 Load Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile");
        setForm(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Update Profile
  const handleUpdate = async () => {
    try {
      await API.put("/profile", form);
      alert("Profile updated ✅");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  // 🔹 Upload Resume
  const handleUpload = async () => {
    const data = new FormData();
    data.append("resume", resume);

    try {
      await API.post("/upload-resume", data);
      alert("Resume uploaded ✅");
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">My Profile</h1>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          name="education"
          value={form.education}
          onChange={handleChange}
          placeholder="Education"
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          name="skills"
          value={form.skills}
          onChange={handleChange}
          placeholder="Skills"
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Experience"
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleUpdate}
          className="bg-blue-700 text-white px-4 py-2 rounded w-full mb-4"
        >
          Update Profile
        </button>

        {/* Resume Upload */}
        <input
          type="file"
          onChange={(e) => setResume(e.target.files[0])}
          className="mb-2"
        />

        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Upload Resume
        </button>
      </div>
    </div>
  );
}

export default Profile;