import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
import authMiddleware from "./middleware/authMiddleware.js";
import upload from "./middleware/uploadMiddleware.js";
import Job from "./models/Job.js";
import Application from "./models/Application.js";
import Quiz from "./models/Quiz.js";
import QuizResult from "./models/QuizResult.js";
import sendEmail from "./utils/sendEmail.js";
// import User from "./models/User.js";
// load env variables
// dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());


// connect database
connectDB();


// console.log("EMAIL:", process.env.EMAIL_USER);
// console.log("PASS:", process.env.EMAIL_PASS);
// routes
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/api/profile", authMiddleware, async (req, res) => {
  try {

    // get user id from token
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

app.put("/api/profile", authMiddleware, async (req, res) => {
  try {

    console.log("USER ID:", req.user.id);
    console.log("BODY:", req.body);
const { name, email, education, skills, experience } = req.body;

const user = await User.findByIdAndUpdate(
  req.user.id,
  { name, email, education, skills, experience },
  { returnDocument: "after" }
).select("-password");

    res.json({
      message: "Profile updated",
      user
    });

  } catch (error) {
    console.log("ERROR:", error.message);  // 👈 IMPORTANT
    res.status(500).json({
      message: "Error updating profile",
      error: error.message
    });
  }
});

app.post("/api/upload-resume", authMiddleware, upload.single("resume"), async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resume: req.file.path },
      { returnDocument: "after" }
    );

    res.json({
      message: "Resume uploaded",
      file: req.file.path
    });

  } catch (error) {
    res.status(500).json({ message: "Upload error" });
  }
});

app.post("/api/jobs", authMiddleware, async (req, res) => {
  try {

    // 🔐 ONLY ADMIN CAN POST
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can post jobs ❌" });
    }

    const { title, company, location, salary, description } = req.body;

    const job = new Job({
      title,
      company,
      location,
      salary,
      description,
      createdBy: req.user.id
    });

    await job.save();

    res.json({
      message: "Job posted successfully",
      job
    });

  } catch (error) {
    res.status(500).json({ message: "Error posting job" });
  }
});

app.get("/api/admin/jobs", authMiddleware, async (req, res) => {
  try {

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin ❌" });
    }

    const jobs = await Job.find({ createdBy: req.user.id });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

app.get("/api/jobs", async (req, res) => {
  try {

    const jobs = await Job.find().populate("createdBy", "name email");

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

app.post("/api/apply/:jobId", authMiddleware, async (req, res) => {
  try {

    const { jobId } = req.params;

    // check if already applied
    const existing = await Application.findOne({
      user: req.user.id,
      job: jobId
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = new Application({
      user: req.user.id,
      job: jobId
    });

    await application.save();

    res.json({
      message: "Applied successfully",
      application
    });

  } catch (error) {
    res.status(500).json({ message: "Error applying job" });
  }
});

// PUT /api/applications/status/:id

// app.put("/status/:id", async (req, res) => {
//   try {
//     const { status } = req.body;

//     const updatedApp = await Application.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     res.json(updatedApp);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating status" });
//   }
// });

app.put("/api/application/status/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed ❌" });
    }

    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: "Application status updated ✅",
      application
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
});

app.delete("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {

    // 🔐 Only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed ❌" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔥 IMPORTANT CHECK (ownership)
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own jobs ❌"
      });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted successfully ✅" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting job" });
  }
});

app.put("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {

    // 🔐 Only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed ❌" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔥 STEP 3 (YOUR QUESTION)
    // 👉 OWNERSHIP CHECK
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own jobs ❌"
      });
    }

    // ✅ Update job
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Job updated successfully ✅",
      job: updatedJob
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating job" });
  }
});

app.get("/api/applicants/:jobId", authMiddleware, async (req, res) => {
  try {

    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("user", "name email resume")
      .populate("job", "title");

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: "Error fetching applicants" });
  }
});

// test route
app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

// app.put("/api/application/:id", authMiddleware, async (req, res) => {
//   try {

//     console.log("PARAM ID:", req.params.id);
//     console.log("BODY:", req.body);

//     const { status } = req.body;

//     const application = await Application.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { returnDocument: "after" }
//     );

//     console.log("UPDATED:", application);

//     res.json({
//       message: "Status updated",
//       application
//     });

//   } catch (error) {
//     console.log("ERROR:", error.message); // 👈 IMPORTANT
//     res.status(500).json({
//       message: "Error updating status",
//       error: error.message
//     });
//   }
// });

app.get("/api/my-applications", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
});

app.post("/api/quiz/:jobId", authMiddleware, async (req, res) => {
  try {

    // 🔐 ONLY ADMIN
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can create quiz ❌"
      });
    }

    const { jobId } = req.params;

    const { questions, duration, passingMarks, startTime, endTime } = req.body;

    // ❌ CHECK IF QUIZ ALREADY EXISTS
    const existingQuiz = await Quiz.findOne({ job: jobId });

    if (existingQuiz) {
      return res.status(400).json({
        message: "Quiz already exists for this job ❌"
      });
    }

    // ✅ CREATE QUIZ
    const quiz = new Quiz({
      job: jobId,
      questions,
      duration,
      passingMarks,
      startTime,
      endTime
    });

    await quiz.save();

    res.json({
      message: "Quiz created successfully ✅",
      quiz
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating quiz"
    });
  }
});

app.get("/api/quiz/:jobId", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.params;

    // 🔹 Check if user applied for this job
    const application = await Application.findOne({
      user: req.user.id,
      job: jobId,
    });

    if (!application) {
      return res.status(400).json({
        message: "You must apply for this job first ❗",
      });
    }

    // 🔹 Check if admin approved the application
    if (application.status !== "accepted") {
      return res.status(403).json({
        message: "Your application is not approved yet ❌",
      });
    }

    // 🔹 Fetch quiz for this job
    const quiz = await Quiz.findOne({ job: jobId });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not available",
      });
    }

    // 🔹 Check if quiz is active
    const now = new Date();
    if (now < quiz.startTime || now > quiz.endTime) {
      return res.status(403).json({
        message: "Quiz not available at this time ⏱️",
      });
    }

    // 🔹 Send quiz to frontend
    res.json(quiz);

    console.log("QUIZ API HIT ✅");
    console.log("QUESTIONS:", quiz.questions);
  } catch (error) {
    console.log("FETCH QUIZ ERROR:", error.message);
    res.status(500).json({
      message: "Error fetching quiz",
      error: error.message
    });
  }
});

app.post("/api/quiz/submit/:jobId", authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOne({
  user: req.user.id,
  job: req.params.jobId,
});

if (!application) {
  return res.status(400).json({
    message: "Apply first ❗",
  });
}

if (application.status !== "accepted") {
  return res.status(403).json({
    message: "Not allowed to attempt quiz ❌",
  });
}

    console.log("BODY:", req.body);

    const { answers } = req.body;

    // check answers exist
    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: "Answers required" });
    }

    // get quiz
    const quiz = await Quiz.findOne({ job: req.params.jobId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;

    // calculate score
    quiz.questions.forEach((q, index) => {
      if (q.answer === answers[index]) {
        score++;
      }
    });

    // pass condition (you can change later)
    const passed = score >= quiz.passingMarks;

    // save result
    const result = new QuizResult({
      user: req.user.id,
      job: req.params.jobId,
      score,
      passed,
      applicationId: application._id   // ✅ IMPORTANT

    });

    await result.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      total: quiz.questions.length,
      passed
    });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.status(500).json({
      message: "Error submitting quiz",
      error: error.message
    });
  }
});

app.get("/api/admin/quiz/stats/:jobId", authMiddleware, async (req, res) => {
  try {
    const results = await QuizResult.find({ job: req.params.jobId });

    if (results.length === 0) {
      return res.json({ average: 0 });
    }

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);
    const average = totalScore / results.length;

    res.json({
      average: average.toFixed(2),
      totalAttempts: results.length
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// app.get("/api/quiz/results/:jobId", authMiddleware, async (req, res) => {
//   const results = await QuizResult.find({ job: req.params.jobId, passed: true })
//     .populate("user", "name email");

//   res.json(results);
// });

app.get("/api/quiz/results/:jobId", authMiddleware, async (req, res) => {
  try {

    const results = await QuizResult.find({
      job: req.params.jobId,
      passed: true
    })
    .populate("user", "name email")
    .lean();

    // 🔥 format data
    const formatted = results.map(r => ({
      _id: r._id,
      user: r.user,
      score: r.score,
      applicationId: r.applicationId, // ✅ MUST
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: "Error fetching results" });
  }
});

app.put("/api/admin/quiz/:jobId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed ❌" });
    }

    const { questions, duration, passingMarks, startTime, endTime } = req.body;

    const quiz = await Quiz.findOneAndUpdate(
      { job: req.params.jobId },
      { questions, duration, passingMarks, startTime, endTime },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found ❌" });
    }

    res.json({
      message: "Quiz updated successfully ✅",
      quiz
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating quiz" });
  }
});

app.get("/api/admin/quiz/:jobId", authMiddleware, async (req, res) => {
  try {

    // 🔐 Only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin ❌" });
    }

    const quiz = await Quiz.findOne({ job: req.params.jobId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found ❌" });
    }

    res.json(quiz);

  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz" });
  }
});


app.delete("/api/admin/quiz/:jobId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed ❌" });
    }

    const quiz = await Quiz.findOneAndDelete({ job: req.params.jobId });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found ❌" });
    }

    res.json({ message: "Quiz deleted successfully ✅" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz" });
  }
});

app.post("/api/admin/send-emails/:jobId", authMiddleware, async (req, res) => {
  try {
    const { meetLink } = req.body;

    // 🔥 Get passed candidates
    const results = await QuizResult.find({
      job: req.params.jobId,
      passed: true
    }).populate("user", "name email");

    if (results.length === 0) {
      return res.json({ message: "No passed candidates" });
    }

    // 🔥 Send email to each candidate
    for (let r of results) {
      const name = r.user.name;
      const email = r.user.email;

      const message = `
Hello ${name},

Congratulations 🎉

You have successfully cleared the quiz round.

We would like to invite you for the next round (Interview).

📅 Google Meet Link:
${meetLink}

Please join on time.

Best Regards,  
HR Team
      `;

      await sendEmail(email, "Interview Invitation", message);
    }

    res.json({ message: "Emails sent successfully ✅" });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error sending emails" });
  }
});

// ✅ FINAL SELECTION API
app.put("/api/admin/final-result/:applicationId", authMiddleware, async (req, res) => {
  try {

    // 🔐 Only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin allowed ❌" });
    }

    const { applicationId } = req.params;
    const { finalStatus } = req.body;

    // ✅ Validate status
    if (!["selected", "rejected"].includes(finalStatus)) {
      return res.status(400).json({ message: "Invalid status ❌" });
    }

    // 🔍 Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found ❌" });
    }

    // 🔥 Update status
    application.finalStatus = finalStatus;
    await application.save();

    res.json({
      message: `Candidate ${finalStatus} successfully ✅`,
      application
    });

  } catch (error) {
    console.log("FINAL ERROR:", error.message);
    res.status(500).json({
      message: "Error updating final result",
      error: error.message
    });
  }
});

// app.put("/api/final-result/:id", authMiddleware, async (req, res) => {
//   try {

//     if (req.user.role !== "admin") {
//       return res.status(403).json({ message: "Only admin allowed ❌" });
//     }

//     const { finalStatus } = req.body;

//     if (!["selected", "rejected"].includes(finalStatus)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const application = await Application.findByIdAndUpdate(
//       req.params.id,
//       { finalStatus },
//       { new: true }
//     );

//     res.json({
//       message: "Final decision updated ✅",
//       application
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Error updating result" });
//   }
// });

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

