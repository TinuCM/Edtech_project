import express from "express";
import { startQuiz, submitAnswer } from "../controllers/quiz.controller.js";

const router = express.Router();

router.get("/start", startQuiz);
router.post("/answer", submitAnswer);

export default router;
