const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const QuizQuestions = mongoose.model("quizquestions");
const QuizScore = mongoose.model("quizScores");
const Leaderboard = mongoose.model("leaderboards");

module.exports = (app) => {
  // Get quiz questions for a chapter
  app.get("/api/v1/quiz/questions/:chapterId", requireLogin, async (req, res) => {
    const { chapterId } = req.params;
    const { childId } = req.query;
    const parentId = req.user._id;
    const User = mongoose.model("edtechusers");

    try {
      // Use childId if provided
      let actualUserId = parentId;
      if (childId) {
        const child = await User.findOne({ _id: childId, parentId });
        if (!child) {
          return res.status(403).json({ message: "Child not found or access denied" });
        }
        actualUserId = childId;
      }

      const questions = await QuizQuestions.find({ chapterId });

      if (!questions || questions.length === 0) {
        return res.status(404).json({ message: "No quiz questions found for this chapter" });
      }

      // Return questions without correct answers
      const questionsWithoutAnswers = questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options
      }));

      res.status(200).json({
        message: "Quiz questions retrieved successfully",
        questions: questionsWithoutAnswers,
        totalQuestions: questions.length
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Submit quiz answers and get score
  app.post("/api/v1/quiz/submit", requireLogin, async (req, res) => {
    const { chapterId, answers, childId } = req.body; // answers: [{ questionId, selectedAnswer }]
    const parentId = req.user._id;
    const User = mongoose.model("edtechusers");

    try {
      const Chapter = mongoose.model("chapters");
      const chapter = await Chapter.findById(chapterId);
      
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      // Use childId if provided
      let actualUserId = parentId;
      if (childId) {
        const child = await User.findOne({ _id: childId, parentId });
        if (!child) {
          return res.status(403).json({ message: "Child not found or access denied" });
        }
        actualUserId = childId;
      }

      // Get all questions for this chapter
      const questions = await QuizQuestions.find({ chapterId });
      
      if (questions.length === 0) {
        return res.status(404).json({ message: "No quiz questions found" });
      }

      // Calculate score
      let correctAnswers = 0;
      const results = questions.map(question => {
        const userAnswer = answers.find(a => a.questionId === question._id.toString());
        const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;
        if (isCorrect) correctAnswers++;
        
        return {
          questionId: question._id,
          question: question.question,
          correctAnswer: question.correctAnswer,
          userAnswer: userAnswer?.selectedAnswer || null,
          isCorrect
        };
      });

      const score = (correctAnswers / questions.length) * 100;
      const totalMarks = questions.length;

      // Save quiz score
      let quizScore = await QuizScore.findOne({ userId: actualUserId, chapterId });
      if (!quizScore) {
        quizScore = await QuizScore.create({
          userId: actualUserId,
          subjectId: chapter.subjectId,
          chapterId,
          score: correctAnswers,
          totalMarks
        });
      } else {
        quizScore.score = correctAnswers;
        quizScore.totalMarks = totalMarks;
        await quizScore.save();
      }

      // Update leaderboard
      const user = await User.findById(actualUserId);
      if (user && user.classno) {
        let leaderboard = await Leaderboard.findOne({ userId: actualUserId, classnumber: user.classno });
        if (!leaderboard) {
          leaderboard = await Leaderboard.create({
            userId: actualUserId,
            classnumber: user.classno,
            totalScore: correctAnswers
          });
        } else {
          leaderboard.totalScore = (leaderboard.totalScore || 0) + correctAnswers;
          await leaderboard.save();
        }
      }

      res.status(200).json({
        message: "Quiz submitted successfully",
        score: Math.round(score),
        correctAnswers,
        totalMarks,
        results
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
};

