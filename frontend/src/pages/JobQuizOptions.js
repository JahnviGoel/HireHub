import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function JobQuizOptions() {

  const { jobId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/admin/quiz/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setQuiz(res.data);

      } catch (err) {
        console.log("No quiz yet");
      }
    };

    fetchQuiz();
  }, [jobId, token]);

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">Quiz Options</h2>

      {/* ✅ If quiz NOT created */}
      {!quiz && (
        <button
          onClick={() => navigate(`/admin/create-quiz/${jobId}`)}
          className="bg-blue-600 text-white px-4 py-2 w-full mb-3"
        >
          Create Quiz
        </button>
      )}

      {/* ✅ If quiz EXISTS */}
      {quiz && (
        <>
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
            Quiz already created ✅
          </div>

          <button
            onClick={() => navigate(`/admin/view-quiz/${jobId}`)}
            className="bg-indigo-600 text-white px-4 py-2 w-full mb-3"
          >
            View Quiz
          </button>

          <button
            onClick={() => navigate(`/admin/quiz-results/${jobId}`)}
            className="bg-green-600 text-white px-4 py-2 w-full"
          >
            View Passed Candidates
          </button>
        </>
      )}

    </div>
  );
}

export default JobQuizOptions;