// import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import Head from "next/head";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
// import "@/styles/login.css";

// import { CssBaseline } from "@mui/material";


const cookies = new Cookies();

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [role, setRole] = useState("student");

  const sendOtp = async () => {
    const response = await axios.post("/api/v1/parent/login", { email });
    if (response.status === 200) setShowOtp(true);
  };

  const verifyOtp = async () => {
    const response = await axios.post("/api/v1/verify/parent", { email, otp });
    if (response.status === 200) {
      cookies.set("token", response.data.token);
      setShowOtp(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <div className="login-page">
        <div className="login-card">
          {/* LEFT */}
          <div className="login-left">
            <h2 className="login-title">Login to your Account</h2>

            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(_, v) => v && setRole(v)}
              className="role-toggle"
            >
              <ToggleButton value="student">Student</ToggleButton>
              <ToggleButton value="parent">Parent</ToggleButton>
            </ToggleButtonGroup>

            {!showOtp ? (
              <>
                <div className="input-label">Email address</div>
                <TextField
                  fullWidth
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  className="primary-btn"
                  onClick={sendOtp}
                >
                  Send OTP
                </Button>
              </>
            ) : (
              <>
                <div className="input-label">Enter OTP</div>
                <TextField
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  sx={{ mb: 3 }}
                />

                <Button
                  fullWidth
                  className="primary-btn"
                  onClick={verifyOtp}
                >
                  Login
                </Button>
              </>
            )}

            <div className="footer-text">
              Don’t have an account?{" "}
              <span className="signup-link">Sign Up</span>
            </div>
          </div>

          {/* RIGHT (GIF goes here) */}
          <div className="login-right">
            <img
              src="/cat.gif"
              alt="Login Illustration"
              className="login-gif"
            />
          </div>
        </div>
      </div>
    </>
  );
}
