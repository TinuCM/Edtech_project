const mongoose = require("mongoose");
const { Schema } = mongoose;


const quizQuestionSchema = new mongoose.Schema({
  subjectId: mongoose.Schema.Types.ObjectId,
  chapterId: mongoose.Schema.Types.ObjectId,
  question: String,
  options: [String],
  correctAnswer: String
});

mongoose.model("quizquestions",quizQuestionSchema);