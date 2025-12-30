import React from "react";
import "@fontsource/alfa-slab-one";

import {
  Box,
  Button,
  IconButton,
  Typography
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function QuizIntroPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Back Arrow */}
      <IconButton
        sx={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      {/* Text + Button — PERFECT CENTER */}
      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
          px: 2,
          zIndex: 2,
        }}
      >
        <Typography
          align="center"
          sx={{
            fontSize: { xs: 28, md: 36 },
            fontWeight: 900,
            mb: 2.5,
            fontFamily: "'Alfa Slab One', cursive",
            color: "#000",
            lineHeight: 1.25,
          }}
        >
          Let’s check what you have <br /> learned!
        </Typography>

        <Button
          variant="contained"
          sx={{
            px: 5,
            py: 1.3,
            borderRadius: 999,
            backgroundColor: "#ff8c00",
            textTransform: "none",
            fontWeight: 700,
            fontSize: 16,
            boxShadow: "0 8px 20px rgba(255,140,0,0.35)",
            "&:hover": {
              backgroundColor: "#fb8c00",
            },
          }}
        >
          Quiz 👉
        </Button>
      </Box>

      {/* Dino GIF — UNCHANGED */}
     <Box
  component="img"
  src="/dino.gif"
  alt="Dino"
  sx={{
    position: "absolute",
    bottom: { xs: -20, md: -30 },
    left: "50%",
    transform: "translateX(-50%)",
    width: { xs: 460, md: 600 },
    maxWidth: "95vw",
    zIndex: 1,
  }}
/>

    </Box>
  );
}
