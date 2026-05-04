import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Quiz() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const token = localStorage.getItem("token");

  // ✅ Fetch Quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quiz/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(""));

        const duration = res.data.duration || 10; // minutes
        setTimeLeft(duration * 60);

      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Access denied ❌");
        navigate("/jobs");
      }
    };

    fetchQuiz();
  }, [jobId, token, navigate]);

  // ✅ Handle Answer Change
  const handleChange = (qIndex, option) => {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  // ✅ Submit Quiz (FIXED with useCallback)
  const handleSubmit = useCallback(async () => {
    try {
      const res = await API.post(
        `/quiz/submit/${jobId}`,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        `Score: ${res.data.score}/${res.data.total}\n${
          res.data.passed ? "Passed ✅" : "Failed ❌"
        }`
      );

      navigate("/my-applications");

    } catch (err) {
      console.error(err);
      alert("Submission failed ❌");
    }
  }, [answers, jobId, token, navigate]);

  // ⏱️ Timer
  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // ✅ safe now
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  if (!quiz) return <p className="p-6">Loading quiz...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-4">Quiz</h2>

      {/* ⏱️ Timer */}
      <div className="text-red-600 font-bold mb-4">
        Time Left: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}
      </div>

      {/* Questions */}
      {quiz.questions.map((q, index) => (
        <div key={index} className="bg-white p-4 mb-4 shadow rounded">

          <p className="font-semibold">
            Q{index + 1}. {q.question}
          </p>

          <div className="mt-2 space-y-2">
            {q.options.map((opt, i) => (
              <label key={i} className="block cursor-pointer">
                <input
                  type="radio"
                  name={`q-${index}`}
                  value={opt}
                  checked={answers[index] === opt}
                  onChange={() => handleChange(index, opt)}
                />
                <span className="ml-2">{opt}</span>
              </label>
            ))}
          </div>

        </div>
      ))}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
      >
        Submit Quiz
      </button>

    </div>
  );
}

export default Quiz;