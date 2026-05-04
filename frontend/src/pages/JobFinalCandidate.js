import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function JobFinalCandidates() {

  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ Fetch passed candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await API.get(`/quiz/results/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setCandidates(res.data);

      } catch (err) {
        console.error(err);
        alert("Failed to load candidates ❌");
      }
    };

    fetchCandidates();
  }, [jobId, token]);

  // ✅ FINAL DECISION FUNCTION
  const handleDecision = async (applicationId, status) => {

    if (!applicationId) {
      alert("Application ID missing ❌");
      return;
    }

    try {
      await API.put(
        `/admin/final-result/${applicationId}`,
        { finalStatus: status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert(`Candidate ${status} ✅`);

      // 🔥 update UI instantly
      setCandidates(prev =>
        prev.map(c =>
          c.applicationId === applicationId
            ? { ...c, finalStatus: status }
            : c
        )
      );

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">
        Final Selection
      </h2>

      {candidates.length === 0 ? (
        <p>No candidates passed quiz</p>
      ) : (
        candidates.map(c => (
          <div key={c._id} className="bg-white p-4 mb-4 shadow rounded">

            <h3 className="text-lg font-bold">{c.user?.name}</h3>
            <p>{c.user?.email}</p>
            <p>Score: {c.score}</p>

            <p className="mt-2 font-semibold">
              Status: {c.finalStatus || "Pending"}
            </p>

            <div className="mt-3 space-x-2">

              <button
                onClick={() => handleDecision(c.applicationId, "selected")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Hire
              </button>

              <button
                onClick={() => handleDecision(c.applicationId, "rejected")}
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

export default JobFinalCandidates;