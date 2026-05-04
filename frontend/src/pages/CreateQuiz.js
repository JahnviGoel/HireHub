
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function CreateQuiz() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔹 Quiz Settings
  const [duration, setDuration] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  

  // 🔹 Questions State
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  // ✅ Handle Question Change
  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  // ✅ Handle Option Change
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // ✅ Handle Answer Selection
  const handleAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answer = value;
    setQuestions(updated);
  };

  // ✅ Add New Question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  // ✅ Submit Quiz
  const handleSubmit = async () => {
    // 🔹 Frontend Validation
    if (!duration || !passingMarks || !startTime || !endTime) {
      alert("Please fill all quiz settings.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question || !q.answer || q.options.some((o) => !o)) {
        alert(`Please complete all fields for Question ${i + 1}.`);
        return;
      }
    }

    try {
      await API.post(
        `/quiz/${jobId}`,
        {
          questions,
          duration: Number(duration),
          passingMarks: Number(passingMarks),
          startTime,
          endTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Quiz created successfully ✅");
      navigate("/admin/quiz-management");
    } catch (err) {
      console.error(err);
      alert("Failed to create quiz ❌");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Create Quiz</h2>

      {/* 🔹 Quiz Settings */}
      <div className="bg-white p-4 mb-6 shadow rounded">
        <h3 className="font-bold mb-2">Quiz Settings</h3>

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="number"
          placeholder="Passing Marks"
          value={passingMarks}
          onChange={(e) => setPassingMarks(e.target.value)}
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

      {/* 🔹 Questions */}
      {questions.map((q, index) => (
        <div key={index} className="bg-white p-4 mb-4 shadow rounded">
          <h3 className="font-semibold mb-2">Question {index + 1}</h3>

          <input
            type="text"
            placeholder="Enter question"
            value={q.question}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
            className="border p-2 mb-2 w-full"
          />

          {/* Options */}
          {q.options.map((opt, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, i, e.target.value)}
              className="border p-2 mb-2 w-full"
            />
          ))}

          {/* Answer */}
          <select
            value={q.answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select Correct Answer</option>
            {q.options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt || `Option ${i + 1}`}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Add Question */}
      <button
        onClick={addQuestion}
        className="bg-gray-600 text-white px-4 py-2 mb-4"
      >
        + Add Question
      </button>

      {/* Submit */}
      <br />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2"
      >
        Create Quiz
      </button>
    </div>
  );
}

export default CreateQuiz;