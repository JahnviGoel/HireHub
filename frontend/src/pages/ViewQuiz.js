import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function ViewQuiz() {

  const { jobId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleDelete = async () => {
  try {
    await API.delete(`/admin/quiz/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert("Quiz deleted ✅");
    navigate("/admin/quiz-management");

  } catch (err) {
    console.error(err);
    alert("Delete failed ❌");
  }
};
  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await API.get(`/admin/quiz/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setQuiz(res.data);
    };

    fetchQuiz();
  }, [jobId, token]);

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">Quiz Details</h2>

      <p>Duration: {quiz.duration} mins</p>
      <p>Passing Marks: {quiz.passingMarks}</p>

      {quiz.questions.map((q, i) => (
        <div key={i} className="bg-white p-4 mt-3 shadow">
          <p><b>Q{i + 1}:</b> {q.question}</p>
          {q.options.map((opt, j) => (
            <p key={j}>- {opt}</p>
          ))}
          <p className="text-green-600">Answer: {q.answer}</p>
        </div>
      ))}

      <button
  onClick={() => navigate(`/admin/edit-quiz/${jobId}`)}
  className="bg-yellow-500 text-white px-4 py-2 mt-4"
>
  Edit Quiz
</button>
  
  <button
  onClick={handleDelete}
  className="bg-red-600 text-white px-4 py-2 mt-3"
  >
  Delete Quiz
  </button>
    </div>
  );
}

export default ViewQuiz;