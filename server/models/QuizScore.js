const mongoose = require("mongoose");
const { Schema } = mongoose;


const quizScoreSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  subjectId: mongoose.Schema.Types.ObjectId,
  chapterId: mongoose.Schema.Types.ObjectId,
  score: Number,
  totalMarks: Number
});

mongoose.model("quizScores", quizScoreSchema);