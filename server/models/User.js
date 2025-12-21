const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  classnumber: Number,
  parentnumber:Number,
});
const subjectSchema = new mongoose.Schema({
  classnumber: Number,
  name: String
});

const chapterSchema = new mongoose.Schema({
  subjectId: mongoose.Schema.Types.ObjectId,
  name: String
});
const progressSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  subjectId: mongoose.Schema.Types.ObjectId,
  chapterId: mongoose.Schema.Types.ObjectId,
  completed: Boolean
});
const quizScoreSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  subjectId: mongoose.Schema.Types.ObjectId,
  chapterId: mongoose.Schema.Types.ObjectId,
  score: Number,
  totalMarks: Number
});
const leaderboardSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  classnumber: Number,
  totalScore: Number
});
    
mongoose.model("edtechusers", userSchema);
mongoose.model("subjects", subjectSchema);
mongoose.model("chapters", chapterSchema);
mongoose.model("progress", progressSchema);
mongoose.model("quizScores", quizScoreSchema);
mongoose.model("leaderboards", leaderboardSchema);