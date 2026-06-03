import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required from the uploaded file."],
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required from the uploaded file."],
    },
    notes: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must be assigned to an active Agent."],
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
