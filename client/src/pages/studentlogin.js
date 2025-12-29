import { Box, Container, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import Head from "next/head";
import AuthFrame from "../components/common/AuthFrame";
import { Afacad } from "next/font/google";
import Link from "next/link";




const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const cookies = new Cookies();

//student login component
export default function StudentLogin() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("student"); // student is selected by default

  const handleLogin = async () => {
    try {
      console.log({ name, password });
      const response = await axios.post("/api/v1/student/login", {
        name,
        password,
      });
      // console.log(response.data);
      if (response.status === 200) {
        cookies.set("token", response.data.token);
        console.log("Login successful, token stored in cookies.");
        // window.location.href = "/";
      }
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 500 || error.response.status === 400 || error.response.status === 401) {
          alert("Password and name doesn't match. Please try again.");
        } else {
          alert("Login failed. Please try again.");
        }
      } else {
        // Network error or server not responding
        alert("Unable to connect to server. Please check your connection.");
      }
    }
  };

  return (
    <>
      <Head>
        <title>Student Login</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthFrame>
      
          {/* Left section - Form */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            
        <div className="form-section">
        <h1 className={afacad.className}>Login to your Account</h1>
         {/* Student/Parent toggle */}
          {/* Student/Parent toggle */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",   // ✅ centers toggle
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
      onClick={() => setUserType("student")}
      disableRipple
      sx={{
        backgroundColor: "#FFFFFF !important",
        color: "#000000 !important",
        padding: "8px 32px",
        borderRadius: 0,
        textTransform: "none",
        fontSize: "16px",
        fontWeight: "500",
        "&:hover": {
          backgroundColor: "#F5F5F5 !important",
        },
      }}
    >
      Student
    </Button>

    <Button
      onClick={() => (window.location.href = "/parentlogin")}
      disableRipple
      sx={{
        backgroundColor: "#000000 !important",
        color: "#FFFFFF !important",
        padding: "8px 32px",
        borderRadius: 0,
        textTransform: "none",
        fontSize: "16px",
        fontWeight: "500",
        "&:hover": {
          backgroundColor: "#333333 !important",
        },
      }}
    >
      Parent
    </Button>
  </Box>
</Box>
  
        <label className={afacad.className}>Student’s Name</label>
        <input type="text" placeholder="Enter your name" />

        <label className={afacad.className}>Password</label>
        <input type="password" placeholder="Enter your password" />

        <button className={`primary-btn ${afacad.className}`}>
          Login
        </button>

        
      </div>
      
            {/* Sign up link */}
            <Box sx={{ mt: 6, textAlign: "center" }}>
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

