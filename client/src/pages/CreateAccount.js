import Image from "next/image";
import AuthFrame from "../components/common/AuthFrame";
import catImage from "../../public/cats.gif";
import { Afacad } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";


const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function CreateAccount() {
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

        <label className={afacad.className}>Student’s Name</label>
        <input type="text" placeholder="Enter your name" />

        <label className={afacad.className}>Email address</label>
        <input type="email" placeholder="Enter your email" />

        <label className={afacad.className}>Password</label>
        <input type="password" placeholder="Enter your password" />

        <button className={`primary-btn ${afacad.className}`}>
          Create Account
        </button>

        <p className="signin-text">
          Already have an account? <Link href="/studentlogin" passHref>
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
