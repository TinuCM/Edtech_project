const mongoose = require("mongoose");
require("dotenv").config();

const QuizQuestions = require("./models/QuizQuestions");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => console.error(err));

const questions = [
  /* =========================
     EASY QUESTIONS (FOUNDATION)
  ========================== */

  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "addition",
    difficulty: "easy",
    question: "What is 1 + 2?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "3",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "addition",
    difficulty: "easy",
    question: "What is 2 + 3?",
    options: ["4", "5", "6", "7"],
    correctAnswer: "5",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "addition",
    difficulty: "easy",
    question: "What is 4 + 1?",
    options: ["4", "5", "6", "7"],
    correctAnswer: "5",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "subtraction",
    difficulty: "easy",
    question: "What is 5 − 2?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "3",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "subtraction",
    difficulty: "easy",
    question: "What is 6 − 1?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "5",
    isActive: true,
  },

  /* =========================
     MEDIUM QUESTIONS
  ========================== */

  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "addition",
    difficulty: "medium",
    question: "What is 7 + 6?",
    options: ["11", "12", "13", "14"],
    correctAnswer: "13",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "addition",
    difficulty: "medium",
    question: "What is 9 + 5?",
    options: ["13", "14", "15", "16"],
    correctAnswer: "14",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "subtraction",
    difficulty: "medium",
    question: "What is 12 − 5?",
    options: ["5", "6", "7", "8"],
    correctAnswer: "7",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "subtraction",
    difficulty: "medium",
    question: "What is 15 − 7?",
    options: ["6", "7", "8", "9"],
    correctAnswer: "8",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "numbers",
    difficulty: "medium",
    question: "Which number is bigger?",
    options: ["18", "21", "15", "12"],
    correctAnswer: "21",
    isActive: true,
  },

  /* =========================
     HARD QUESTIONS (CHALLENGE)
  ========================== */

  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "addition",
    difficulty: "hard",
    question: "What is 18 + 7?",
    options: ["24", "25", "26", "27"],
    correctAnswer: "25",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "addition",
    difficulty: "hard",
    question: "What is 25 + 9?",
    options: ["32", "33", "34", "35"],
    correctAnswer: "34",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "subtraction",
    difficulty: "hard",
    question: "What is 30 − 14?",
    options: ["14", "15", "16", "17"],
    correctAnswer: "16",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "numbers",
    difficulty: "hard",
    question: "Which is the smallest number?",
    options: ["19", "22", "17", "20"],
    correctAnswer: "17",
    isActive: true,
  },
  {
    subject: "math",
    chapterId: "chapter_1",
    topic: "numbers",
    difficulty: "hard",
    question: "What comes after 39?",
    options: ["38", "40", "41", "42"],
    correctAnswer: "40",
    isActive: true,
  },
];

async function seed() {
  try {
    await QuizQuestions.deleteMany({ subject: "math", chapterId: "chapter_1" });
    await QuizQuestions.insertMany(questions);
    console.log("✅ Math quiz questions seeded successfully");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
