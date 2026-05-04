import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  questions: [
    {
      question: {
        type: String,
        required: true
      },
      options: {
        type: [String],
        required: true
      },
      answer: {
        type: String,
        required: true
      }
    }
  ],
  duration: Number, // in minutes
  passingMarks: Number,  // minimum score to pass
  startTime: Date,    // quiz start
  endTime: Date           // quiz end
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;