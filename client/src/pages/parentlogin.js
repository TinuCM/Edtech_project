import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import Head from "next/head";
import AuthFrame from "../components/common/AuthFrame";
import { Afacad } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cookies = new Cookies();

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [userType, setUserType] = useState("parent");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const router = useRouter();

  const sendOtp = async () => {
    try {
      console.log(email);
      const response = await axios.post("api/v1/parent/login", { email });
      console.log(response.data);
      if (response.status === 200) {
        setShowOtp(true);
        setMessage("");
        setMessageType("");
      }
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
      setMessageType("error");
    }
  };

  const verifyOtp = async () => {
    // Clear previous messages
    setMessage("");
    setMessageType("");

    // Validate OTP input
    if (!otp) {
      setMessage("Please enter the OTP.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post("/api/v1/verify/parent", {
        email,
        otp,
      });
      
      if (response.status === 200) {
        cookies.set("token", response.data.token);
        console.log("Login successful, token stored in cookies.");
        setMessage("OTP verified successfully! Redirecting...");
        setMessageType("success");
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        const errorMessage = errorData?.message || "";

        if (status === 400) {
          // Invalid OTP
          setMessage("Invalid OTP. Please check and try again.");
          setMessageType("error");
        } else if (status === 404) {
          // User not found
          setMessage("User not found. Please check your email.");
          setMessageType("error");
        } else if (status === 500) {
          // Server error
          setMessage("Server error. Please try again later.");
          setMessageType("error");
        } else {
          setMessage(errorMessage || "OTP verification failed. Please try again.");
          setMessageType("error");
        }
      } else if (error.request) {
        // Request was made but no response received
        setMessage("Unable to connect to server. Please check your connection.");
        setMessageType("error");
      } else {
        // Something else happened
        setMessage("An unexpected error occurred. Please try again.");
        setMessageType("error");
      }
      
      console.log("OTP verification error:", error.response?.status, error.response?.data?.message);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthFrame>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div className="form-section">
            <h1 className={afacad.className}>Login to your Account</h1>

            {/* Student/Parent toggle */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "fit-content",
                  border: "2px solid #000000",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Button
                  onClick={() => (window.location.href = "/studentlogin")}
                  disableRipple
                  sx={{
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                    padding: "8px 32px",
                    borderRadius: 0,
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: "500",
                    "&:hover": {
                      backgroundColor: "#F5F5F5",
                    },
                  }}
                >
                  Student
                </Button>
                <Button
                  disableRipple
                  sx={{
                    backgroundColor: "#000000",
                    color: "#FFFFFF",
                    padding: "8px 32px",
                    borderRadius: 0,
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: "500",
                    cursor: "default",
                  }}
                >
                  Parent
                </Button>
              </Box>
            </Box>

            {/* Message display */}
            {message && (
              <Box
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: "8px",
                  backgroundColor:
                    messageType === "success" ? "#E8F5E9" : "#FFEBEE",
                  color: messageType === "success" ? "#2E7D32" : "#C62828",
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {message}
              </Box>
            )}

            {/* Conditional rendering based on showOtp */}
            {showOtp ? (
              <>
                <label className={afacad.className}>Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter the OTP sent to your email"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setMessage(""); // Clear message when user types
                  }}
                />
                <button
                  className={`primary-btn ${afacad.className}`}
                  onClick={verifyOtp}
                >
                  Verify OTP
                </button>
              </>
            ) : (
              <>
                <label className={afacad.className}>Email Address</label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage(""); // Clear message when user types
                  }}
                />
                <button
                  className={`primary-btn ${afacad.className}`}
                  onClick={sendOtp}
                >
                  Send OTP
                </button>
              </>
            )}

            {/* Sign up link - moved inside form-section */}
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
                Don't have an account?{" "}
                <Link href="/CreateAccount" passHref>
                  <span
                    style={{
                      color: "#1E88E5",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Sign Up
                  </span>
                </Link>
              </Typography>
            </Box>
          </div>
        </Box>

        {/* Right section - Cat illustration */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="/cats.gif"
            alt="Cat illustration"
            sx={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
            }}
          />
        </Box>
      </AuthFrame>
    </>
  );
}