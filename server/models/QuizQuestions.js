const mongoose = require("mongoose");

const QuizQuestionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * 🔑 THIS LINE IS THE MOST IMPORTANT
 * Without this → findOne WILL NOT WORK
 */
module.exports = mongoose.model("QuizQuestion", QuizQuestionSchema);
