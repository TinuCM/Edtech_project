import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import AuthFrame from "../components/common/AuthFrame";
import catImage from "../../public/cats.gif";
import { Afacad } from "next/font/google";
import Link from "next/link";

const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function CreateAccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleCreateAccount = async () => {
    try {
      const response = await axios.post("/api/v1/user/add", {
        name,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        setMessage("Account created successfully!");
        setTimeout(() => {
          router.push("/studentlogin");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data?.message || "Failed to create account");
      } else {
        setMessage("An error occurred. Please try again.");
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

        {message && <p style={{ color: message.includes("success") ? "green" : "red" }}>{message}</p>}

        <label className={afacad.className}>Student's Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className={afacad.className}>Email address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className={afacad.className}>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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