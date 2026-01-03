const express = require("express");
//const Question = require("../models/Question");
const Question = require("../models/QuizQuestions");

const Attempt = require("../models/Attempt");
const Leaderboard = require("../models/Leaderboard");
const { calculatePoints } = require("../utils/points");
const { callAdaptiveEngine } = require("../utils/adaptiveClient");

const router = express.Router();

/* -------------------------
   START QUIZ
-------------------------- */
router.get("/start", async (req, res) => {
  try {
    const { childId, subject } = req.query;

    if (!childId || !subject) {
      return res.status(400).json({ message: "Missing childId or subject" });
    }

    const question = await Question.findOne({
      subject,
      difficulty: "easy",
      isActive: true,
    });

    if (!question) {
      return res.json({ completed: true });
    }

    res.json({ completed: false, question });
  } catch (err) {
    console.error("QUIZ START ERROR:", err);
    res.status(500).json({ message: "Failed to start quiz" });
  }
});

/* -------------------------
   SUBMIT ANSWER
-------------------------- */
router.post("/answer", async (req, res) => {
  try {
    const { childId, questionId, isCorrect } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Save attempt
    await Attempt.create({
      childId,
      questionId,
      subject: question.subject,
      topic: question.topic,
      difficulty: question.difficulty,
      isCorrect,
    });

    // Points
    const points = calculatePoints(question.difficulty, isCorrect);

    // Leaderboard
    await Leaderboard.findOneAndUpdate(
      { childId },
      {
        $inc: {
          [`subjects.${question.subject}`]: points,
          totalPoints: points,
        },
        $set: { updatedAt: new Date() },
      },
      { upsert: true }
    );

    // Recent attempts
    const attempts = await Attempt.find({ childId, subject: question.subject })
      .sort({ createdAt: -1 })
      .limit(5);

    // Adaptive decision
    const adaptive = await callAdaptiveEngine({
      child_id: childId,
      subject: question.subject,
      attempts: attempts.map((a) => ({
        topic: a.topic,
        difficulty: a.difficulty,
        is_correct: a.isCorrect,
      })),
    });

    // Next question
    const attemptedIds = attempts.map((a) => a.questionId);

    const nextQuestion = await Question.findOne({
      subject: question.subject,
      difficulty: adaptive.next_difficulty,
      _id: { $nin: attemptedIds },
      isActive: true,
    });

    if (!nextQuestion) {
      return res.json({ completed: true });
    }

    res.json({
      completed: false,
      question: nextQuestion,
      adaptive,
    });
  } catch (err) {
    console.error("QUIZ ANSWER ERROR:", err);
    res.status(500).json({ message: "Quiz evaluation failed" });
  }
});

module.exports = router;
