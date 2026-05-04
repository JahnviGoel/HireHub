import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function EditQuiz() {

  const { jobId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [duration, setDuration] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // ✅ Fetch existing quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await API.get(`/admin/quiz/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = res.data;

      setQuiz(data);
      setQuestions(data.questions);
      setDuration(data.duration);
      setPassingMarks(data.passingMarks);
      setStartTime(data.startTime?.slice(0,16));
      setEndTime(data.endTime?.slice(0,16));
    };

    fetchQuiz();
  }, [jobId, token]);

  // ✅ Handlers
  const handleQuestionChange = (i, value) => {
    const updated = [...questions];
    updated[i].question = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qi, oi, value) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (qi, value) => {
    const updated = [...questions];
    updated[qi].answer = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" }
    ]);
  };

  // ✅ Submit update
  const handleUpdate = async () => {
    try {
      await API.put(`/admin/quiz/${jobId}`, {
        questions,
        duration,
        passingMarks,
        startTime,
        endTime
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Quiz updated ✅");
      navigate(`/admin/view-quiz/${jobId}`);

    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">Edit Quiz</h2>

      {/* Settings */}
      <div className="bg-white p-4 mb-6 shadow">
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration"
          className="border p-2 mb-2 w-full"
        />

        <input
          type="number"
          value={passingMarks}
          onChange={(e) => setPassingMarks(e.target.value)}
          placeholder="Passing Marks"
          className="border p-2 mb-2 w-full"
        />

        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={i} className="bg-white p-4 mb-4 shadow">

          <input
            value={q.question}
            onChange={(e) => handleQuestionChange(i, e.target.value)}
            className="border p-2 mb-2 w-full"
          />

          {q.options.map((opt, j) => (
            <input
              key={j}
              value={opt}
              onChange={(e) => handleOptionChange(i, j, e.target.value)}
              className="border p-2 mb-2 w-full"
            />
          ))}

          <select
            value={q.answer}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            className="border p-2 w-full"
          >
            <option>Select Answer</option>
            {q.options.map((opt, j) => (
              <option key={j} value={opt}>{opt}</option>
            ))}
          </select>

        </div>
      ))}

      <button
        onClick={addQuestion}
        className="bg-gray-600 text-white px-4 py-2 mb-4"
      >
        + Add Question
      </button>

      <br />

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-6 py-2"
      >
        Update Quiz
      </button>

    </div>
  );
}

export default EditQuiz;