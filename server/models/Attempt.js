import mongoose from "mongoose";

const AttemptSchema = new mongoose.Schema({
  childId: String,
  questionId: mongoose.Schema.Types.ObjectId,
  subject: String,
  topic: String,
  difficulty: String,
  isCorrect: Boolean,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Attempt", AttemptSchema);
