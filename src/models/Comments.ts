import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: [true, "add comment content"],
    },
  },
  { timestamps: true }
);

