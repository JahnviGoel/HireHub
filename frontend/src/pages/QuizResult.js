import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function QuizResults() {

  const { jobId } = useParams();
  const [results, setResults] = useState([]);

  const token = localStorage.getItem("token");

  const handleSendEmails = async () => {
  const meetLink = prompt("Enter Google Meet Link");

  if (!meetLink) return;

  try {
    await API.post(
      `/admin/send-emails/${jobId}`,
      { meetLink },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert("Emails sent successfully ✅");

  } catch (err) {
    console.error(err);
    alert("Failed to send emails ❌");
  }
};

  // ✅ Fetch passed candidates
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get(`/quiz/results/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setResults(res.data);

      } catch (err) {
        console.error(err);
        alert("Failed to load results ❌");
      }
    };

    fetchResults();
  }, [jobId, token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">
        Passed Candidates 🎯
      </h2>

      {results.length === 0 ? (
        <p>No candidates passed yet</p>
      ) : (
        results.map((res) => (
          <div
            key={res._id}
            className="bg-white p-5 mb-4 shadow rounded"
          >
            <h3 className="text-lg font-bold">
              {res.user.name}
            </h3>

            <p>Email: {res.user.email}</p>

            <p className="mt-2">
              Score: {res.score} / {res.total}
            </p>

            <p className="text-green-600 font-semibold">
              Passed ✅
            </p>
          </div>
        ))
      )}

      <button
  onClick={handleSendEmails}
  className="bg-purple-600 text-white px-4 py-2 mb-4"
>
  Send Interview Emails 📧
</button>

    </div>
  );
}

export default QuizResults;