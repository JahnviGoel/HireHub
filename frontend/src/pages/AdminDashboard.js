import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate(); // ✅ inside component

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-blue-700 text-white p-4 text-xl font-bold">
        Admin Dashboard
      </div>

      {/* Content */}
      <div className="p-6">

        <h2 className="text-2xl font-semibold mb-4">
          Welcome Admin 👑
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ✅ Manage Jobs clickable */}
          <div
            onClick={() => navigate("/admin/create-job")}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-100"
          >
            <h3 className="text-lg font-bold">Create Jobs</h3>
            <p className="text-gray-600">Create jobs</p>
          </div>

          <div
  onClick={() => navigate("/admin/jobs")}
  className="bg-white p-6 rounded-lg shadow cursor-pointer"
>
  <h3 className="text-lg font-bold">Manage Jobs</h3>
   <p className="text-gray-600">View ,edit, delete Jobs </p>
</div>

          <div
  onClick={() => navigate("/admin/applications")}
  className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-100"
>
  <h3 className="text-lg font-bold">Applications</h3>
  <p className="text-gray-600">Review candidates</p>
</div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 
            onClick={() => navigate("/admin/quiz-management")}
            className="text-lg font-bold">Quiz Management</h3>
            <p className="text-gray-600">Create quizzes,edit,delete ,select candidate according to the quiz result</p>
          </div>

          <div
  onClick={() => navigate("/admin/hire")}
  className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-100"
>
  <h3 className="text-lg font-bold">Hire Candidates</h3>
  <p className="text-gray-600">Final selection after interview</p>
</div>
     
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;