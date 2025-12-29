import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import Head from "next/head";
import catImage from "../../public/cats.gif";
import Image from "next/image";
import Link from "next/link";
// import { CssBaseline } from "@mui/material";

const cookies = new Cookies();
//parent login component
export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [userType, setUserType] = useState("parent"); // parent is selected by default

  const sendOtp = async () => {
    console.log(email);
    const response = await axios.post("api/v1/parent/login", { email });
    console.log(response.data);
    if (response.status === 200) {
      setShowOtp(true);
    }
  };
//parent verify
  const verifyOtp = async () => {
    const response = await axios.post("/api/v1/verify/parent", {
      email,
      otp,
    });
    console.log(response.data);
    if (response.status === 200) {
      setShowOtp(false);
    //   console.log("response.data.token:", response.data.token);
      cookies.set("token", response.data.token);
      //   cookies.set("user", JSON.stringify(response.data.user));
      console.log("Login successful, token stored in cookies.");
      // window.location.href = "/";
    }
    else if (response.status === 400) {
      console.log("OTP verification failed.");
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
      
      {/* Blue gradient background */}
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        {/* White rounded card */}
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "24px",
            padding: { xs: "40px 30px", md: "60px 80px" },
            maxWidth: "1200px",
            width: "100%",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            position: "relative",
          }}
        >
          {/* Left section - Form */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Back arrow and logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Box
                sx={{
                  fontSize: "24px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ←
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component="img"
                  src="/logo1.png"
                  alt="Study.Pilot"
                  sx={{
                    height: "32px",
                    width: "auto",
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: "600",
                  }}
                >
                  Study.Pilot
                </Typography>
              </Box>
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontSize: { xs: "28px", md: "36px" },
                fontWeight: "700",
                mb: 4,
                color: "#000000",
              }}
            >
              Login to your Account
            </Typography>

            {/* Student/Parent toggle */}
            <Box
              sx={{
                display: "flex",
                mb: 4,
                gap: 0,
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
                  backgroundColor: "#000000 !important",
                  color: "#FFFFFF !important",
                  padding: "8px 32px",
                  borderRadius: 0,
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#333333 !important",
                  },
                }}
              >
                Student
              </Button>
              <Button
                onClick={() => setUserType("parent")}
                disableRipple
                sx={{
                  backgroundColor: "#FFFFFF !important",
                  color: "#000000 !important",
                  padding: "8px 32px",
                  borderRadius: 0,
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: "500",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#F5F5F5 !important",
                  },
                }}
              >
                Parent
              </Button>
            </Box>

            {/* Form fields */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {showOtp ? (
                <>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "500",
                        mb: 1,
                        color: "#000000",
                      }}
                    >
                      Enter OTP
                    </Typography>
                    <TextField
                      placeholder="Enter the OTP sent to your email"
                      onChange={(event) => {
                        setOtp(event.target.value);
                      }}
                      value={otp}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#FFFFFF",
                          "& fieldset": {
                            borderColor: "#E0E0E0",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#BDBDBD",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1E88E5",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "14px 16px",
                        },
                      }}
                    />
                  </Box>
                  <Button
                    onClick={verifyOtp}
                    fullWidth
                    sx={{
                      backgroundColor: "#000000",
                      color: "#FFFFFF",
                      padding: "14px",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontSize: "18px",
                      fontWeight: "600",
                      mt: 2,
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                    }}
                  >
                    Login
                  </Button>
                </>
              ) : (
                <>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: "500",
                        mb: 1,
                        color: "#000000",
                      }}
                    >
                      Email address
                    </Typography>
                    <TextField
                      placeholder="Enter your email"
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                      value={email}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "#FFFFFF",
                          "& fieldset": {
                            borderColor: "#E0E0E0",
                            borderWidth: "2px",
                          },
                          "&:hover fieldset": {
                            borderColor: "#BDBDBD",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1E88E5",
                          },
                        },
                        "& .MuiOutlinedInput-input": {
                          padding: "14px 16px",
                        },
                      }}
                    />
                  </Box>
                  <Button
                    onClick={sendOtp}
                    fullWidth
                    sx={{
                      backgroundColor: "#000000",
                      color: "#FFFFFF",
                      padding: "14px",
                      borderRadius: "8px",
                      textTransform: "none",
                      fontSize: "18px",
                      fontWeight: "600",
                      mt: 2,
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                    }}
                  >
                    Send OTP
                  </Button>
                </>
              )}
            </Box>

            {/* Sign up link */}
            <Box sx={{ mt: 6 }}>
              <Typography sx={{ fontSize: "14px", color: "#666666" }}>
               Don't have an account?{" "}
                <Link href="/CreateAccount">
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
        </Box>
      </Box>
    </>
  );
};