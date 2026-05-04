import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  finalStatus: {
  type: String,
  enum: ["pending", "selected", "rejected"],
  default: "pending"
}
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;