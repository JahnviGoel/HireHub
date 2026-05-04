import mongoose from "mongoose";
import dotenv from "dotenv";
import Quiz from "./models/Quiz.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const migrateQuizzes = async () => {
  try {
    const quizzes = await Quiz.find({});

    for (const quiz of quizzes) {
      if (!quiz.passingMarks && quiz.questions.length > 0) {
        // Assume passingMarks is in the first question or set default
        const firstQuestion = quiz.questions[0];
        if (firstQuestion.passingMarks) {
          quiz.passingMarks = firstQuestion.passingMarks;
          quiz.duration = firstQuestion.duration || 10;
          quiz.startTime = firstQuestion.startTime;
          quiz.endTime = firstQuestion.endTime;

          // Remove from questions
          quiz.questions = quiz.questions.map(q => ({
            question: q.question,
            options: q.options,
            answer: q.answer
          }));

          await quiz.save();
          console.log(`Migrated quiz for job ${quiz.job}`);
        }
      }
    }

    console.log("Migration complete");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.connection.close();
  }
};

connectDB().then(migrateQuizzes);