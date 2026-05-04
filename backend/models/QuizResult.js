import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  applicationId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Application"
},
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },
  score: Number,
  total: Number,
  passed: Boolean,
}, 
{ timestamps: true });

const QuizResult = mongoose.model("QuizResult", quizResultSchema);

export default QuizResult;