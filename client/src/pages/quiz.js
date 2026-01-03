import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Paper, LinearProgress } from "@mui/material";
import { Cookies } from "react-cookie";
import { useRouter } from "next/router";
import AuthFrame from "../components/common/AuthFrame";

const cookies = new Cookies();
const API_BASE = "http://localhost:5001";
const ELEPHANT_IMG = "/elephant.png";

export default function QuizPage() {
  const router = useRouter();

  const [question, setQuestion] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentQ, setCurrentQ] = useState(1);

  const [childId, setChildId] = useState(null);
  const [subject, setSubject] = useState(null);
  const [chapterId, setChapterId] = useState(null);

  /* 🔐 ROUTE GUARD */
  useEffect(() => {
    const token = cookies.get("token");
    const cId = cookies.get("selectedChildId");
    const sub = cookies.get("selectedSubjectSlug");
    const chId = cookies.get("selectedChapterId");

    if (!token) {
      router.replace("/parentlogin");
      return;
    }

    if (!cId || !sub || !chId) {
      router.replace("/chapters");
      return;
    }

    setChildId(cId);
    setSubject(sub);
    setChapterId(chId);
  }, []);

  /* LOAD QUESTION */
  useEffect(() => {
    if (!childId || !subject || !chapterId) return;
    loadQuestion();
  }, [childId, subject, chapterId]);

  const loadQuestion = async () => {
    const res = await axios.get(`${API_BASE}/api/quiz/start`, {
      params: { childId, subject, chapterId },
    });

    if (res.data.completed) {
      router.replace("/chapters");
      return;
    }

    setQuestion(res.data.question);
  };

  const submitAnswer = async (option) => {
    const isCorrect = option === question.correctAnswer;

    const res = await axios.post(`${API_BASE}/api/quiz/answer`, {
      childId,
      questionId: question._id,
      isCorrect,
    });

    if (res.data.completed) {
      router.replace("/chapters");
      return;
    }

    setCurrentQ((q) => q + 1);
    setQuestion(res.data.question);
  };

  if (!question) {
    return (
      <AuthFrame showBack>
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6">Loading quiz…</Typography>
        </Box>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame showBack>
      <Box sx={{ maxWidth: 1100, p: 5 }}>
        <Typography mb={1}>Question {currentQ} of 5</Typography>

        <LinearProgress
          variant="determinate"
          value={(currentQ / 5) * 100}
          sx={{
            height: 10,
            borderRadius: 5,
            mb: 4,
          }}
        />

        <Typography variant="h4" fontWeight={800} mb={5}>
          {question.question}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 4,
          }}
        >
          {question.options.map((option, index) => (
            <Box
              key={option}
              sx={{ position: "relative" }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => submitAnswer(option)}
            >
              {hoveredIndex === index && (
                <Box
                  component="img"
                  src={ELEPHANT_IMG}
                  alt="Elephant"
                  sx={{
                    position: "absolute",
                    top: -60,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 70,
                  }}
                />
              )}

              <Paper
                elevation={0}
                sx={{
                  height: 90,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 700,
                  cursor: "pointer",
                  bgcolor: "#EFEFEF",
                  "&:hover": {
                    bgcolor: "#F5F5F5",
                  },
                }}
              >
                {option}
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>
    </AuthFrame>
  );
}
