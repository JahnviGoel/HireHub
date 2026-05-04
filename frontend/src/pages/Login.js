import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("user");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const user = res.data.user;

      // ✅ Admin check FIRST
      if (loginType === "admin" && user.role !== "admin") {
        alert("You are not an admin ❌");
        return;
      }

      // ✅ Save after validation
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login Successful");

      // ✅ Navigate properly
      if (loginType === "admin") {
        navigate("/admin");
      } else {
        navigate("/jobs");
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
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

      {/* Login Section */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

          <h2 className="text-2xl font-semibold mb-2">Sign in</h2>
          <p className="text-gray-600 text-sm mb-6">
            Stay updated on your professional world
          </p>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* ✅ Radio Buttons INSIDE form */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="user"
                  checked={loginType === "user"}
                  onChange={(e) => setLoginType(e.target.value)}
                />
                Candidate
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="admin"
                  checked={loginType === "admin"}
                  onChange={(e) => setLoginType(e.target.value)}
                />
                Admin
              </label>
            </div>

            <input
              type="email"
              placeholder="Email or Phone"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white py-3 rounded-full"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            New to RecruitPro?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-700 cursor-pointer hover:underline"
            >
              Join now
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;