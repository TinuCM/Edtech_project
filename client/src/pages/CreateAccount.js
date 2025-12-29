import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AuthFrame from "../components/common/AuthFrame";
import catImage from "../../public/cats.gif";
import { Afacad } from "next/font/google";
import Link from "next/link";
import { Box } from "@mui/material";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const router = useRouter();

  const handleCreateAccount = async () => {
    // Clear previous messages
    setMessage("");
    setMessageType("");

    // Validate inputs
    if (!name || !email || !password) {
      setMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      setMessageType("error");
      return;
    }

    try {
      console.log("Creating account:", { name, email, password });
      const response = await axios.post("/api/v1/student/register", {
        name,
        email,
        password,
      });

      console.log("Response received:", response);

      if (response.status === 200 || response.status === 201) {
        setMessage("Account created successfully! Redirecting to login...");
        setMessageType("success");

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/studentlogin");
        }, 2000);
      }
    } catch (error) {
      console.error("Account creation failed:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);

      if (error.response) {
        // Server responded with an error status
        const status = error.response.status;
        const errorData = error.response.data;
        const errorMessage = errorData?.message || errorData?.error || "";

        if (status === 400) {
          if (errorMessage.toLowerCase().includes("email") || 
              errorMessage.toLowerCase().includes("already exists") ||
              errorMessage.toLowerCase().includes("duplicate")) {
            setMessage("Email already exists. Please use a different email or sign in.");
          } else {
            setMessage(errorMessage || "Invalid information. Please check your details.");
          }
          setMessageType("error");
        } else if (status === 409) {
          setMessage("Email already exists. Please use a different email or sign in.");
          setMessageType("error");
        } else if (status === 500) {
          setMessage("Server error. Please try again later.");
          setMessageType("error");
        } else {
          setMessage(errorMessage || "Failed to create account. Please try again.");
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
    }
  };

  return (
    <AuthFrame>
      {/* Left Image */}
      <div className="image-section">
        <Image
          src={catImage}
          alt="Animated illustration"
          className="gif-image"
          priority
        />
      </div>

      {/* Form */}
      <div className="form-section">
        <h1 className={afacad.className}>Create your Account</h1>

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

        <label className={afacad.className}>Student's Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setMessage(""); // Clear message when user types
          }}
        />

        <label className={afacad.className}>Email address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage(""); // Clear message when user types
          }}
        />

        <label className={afacad.className}>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage(""); // Clear message when user types
          }}
        />

        <button
          className={`primary-btn ${afacad.className}`}
          onClick={handleCreateAccount}
        >
          Create Account
        </button>

        <p className="signin-text">
          Already have an account?{" "}
          <Link href="/studentlogin" passHref>
            <span
              style={{
                color: "#1E88E5",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Sign In
            </span>
          </Link>
        </p>
      </div>
    </AuthFrame>
  );
}