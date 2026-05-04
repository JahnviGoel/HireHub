import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/auth/register", {
        name,
        email,
        password,
        adminKey: isAdmin ? adminKey : null,
      });

      alert("Registration Successful 🎉");

      navigate("/login");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex flex-col">

      {/* Navbar */}
      <div className="bg-white shadow-sm px-8 py-4">
        <h1 className="text-2xl font-bold text-blue-700">HireHub</h1>
      </div>

      {/* Register Form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

          <h2 className="text-2xl font-semibold mb-4">Sign up</h2>

          <form onSubmit={handleRegister} className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-3 rounded-md"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-md"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-md"
              required
            />

            {/* ✅ Admin Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
              />
              <label>Register as Admin</label>
            </div>

            {/* ✅ Admin Key Input */}
            {isAdmin && (
              <input
                type="text"
                placeholder="Enter Admin Secret Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full border p-3 rounded-md"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-full"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-700 cursor-pointer"
            >
              Sign in
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;