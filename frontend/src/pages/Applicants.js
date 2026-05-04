import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { SERVER_BASE_URL } from "../api/axios";

function Applicants() {

  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ Fetch applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await API.get(`/applicants/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setApplicants(res.data);

      } catch (err) {
        console.error(err);
        alert("Error loading applicants ❌");
      }
    };

    fetchApplicants();
  }, [jobId, token]);

  // ✅ Accept / Reject function
  const handleStatus = async (id, status) => {
    try {
      await API.put(
        `/application/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(`Candidate ${status} ✅`);

      // 🔥 update UI
      setApplicants(prev =>
        prev.map(app =>
          app._id === id ? { ...app, status } : app
        )
      );

    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">
        Applicants
      </h2>

      {applicants.length === 0 ? (
        <p>No applicants found</p>
      ) : (
        applicants.map(app => (
          <div key={app._id} className="bg-white p-4 mb-4 shadow rounded">

            <h3 className="text-lg font-bold">
              {app.user?.name}
            </h3>

            <p>{app.user?.email}</p>

            {/* Resume */}
            {app.user?.resume && (
              <a
                href={`${SERVER_BASE_URL}/${app.user.resume}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            )}

            <p className="mt-2 font-semibold">
              Status: {app.status || "Pending"}
            </p>

            {/* 🔥 ACTION BUTTONS */}
            <div className="mt-3 space-x-2">

              <button
                onClick={() => handleStatus(app._id, "accepted")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => handleStatus(app._id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>

            </div>

          </div>
        ))
      )}

    </div>
  );
}

export default Applicants;
