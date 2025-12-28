// import "../styles/CreateAccount.css";
import Image from "next/image";
import blackLogo from "../public/Black logo (1).png";
import catImage from "../public/Cat.gif";
import { Afacad } from "next/font/google";
import Link from "next/link";
const afacad = Afacad({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});


export default function CreateAccount() {
  return (
    <div className="no-scroll-page">
      <div className="card">
        {/* Header */}
        <div className="card-header">
  <div className="header-left">
    <div className="navbar-logo">
      <Image src={blackLogo} alt="Study Pilot Logo" height={25} />
    </div>

    
    <Link href="/">
  <button className="back-btn">←</button>
</Link>
  </div>
</div>


        {/* Main Content */}
        <div className="card-content">
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


            <label  className={afacad.className}>Student’s Name</label>
            <input type="text" placeholder="Enter your name" />

            <label  className={afacad.className}>Email address</label>
            <input type="email" placeholder="Enter your email" />

            <label  className={afacad.className}>Password</label>
            <input type="password" placeholder="Enter your password" />

            <button className={`primary-btn ${afacad.className}`}>
  Create Account
</button>


            <p className="signin-text">
              Already have an account? <span>Sign In</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
