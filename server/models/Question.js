import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  subject: String,
  topic: String,
  difficulty: String, // easy,medium,hard
  question: String,
  options: [String],
  correctAnswer: String,
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("Question", QuestionSchema);
