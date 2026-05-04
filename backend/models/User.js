// Import mongoose (MongoDB library)
import mongoose from "mongoose";

// Create schema (structure of user data)
const userSchema = new mongoose.Schema({

  // User name
  name: {
    type: String,
    required: true
  },

  // User email
  email: {
    type: String,
    required: true,
    unique: true   // no duplicate emails
  },

  // User password
  password: {
    type: String,
    required: true
  },
 education: {
  type: String,
},
skills: {
  type: String,
},
experience: {
  type: String,
},
resume: {
  type: String,
},
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}
}, { timestamps: true }); // auto adds createdAt & updatedAt

// Create model (collection name = users)
const User = mongoose.model("User", userSchema);

// Export model
export default User;