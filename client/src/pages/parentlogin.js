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
  
        <label className={afacad.className}>Email Address</label>
        <input type="text" placeholder="Enter your email" />

        
        <button className={`primary-btn ${afacad.className}`}>
          Send OTP
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
};