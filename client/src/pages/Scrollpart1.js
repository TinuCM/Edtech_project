import Image from "next/image";
import myImage from "./public/Group 34.png";
import logo from "./public/logo.png";
import { Alfa_Slab_One, Poppins, Alegreya } from "next/font/google";
const alfaSlab = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});
const alegreya = Alegreya({
  weight: ["400", "500"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <section className="hero">
      {/* Background image */}
      <div className="hero-bg">
        <Image
          src={myImage}
          alt="Kids learning illustration"
          priority
          fill
          sizes="200vw"
          // style={{ objectFit: "" }}
        />
      </div>
      <nav className="navbar">
      <div className="navbar-logo">
        <Image src={logo} alt="Study Pilot Logo" height={45} />
        <span></span>
      </div>

      <button className="login-btn font-jsMath">LOGIN</button>
    </nav>

      {/* Content on top */}
      <div className={`hero-content ${poppins.className}`}>

        <h1 className={alfaSlab.className}>
         Boost Your <br /> Child’s Future
       </h1>

        <p className={alegreya.className}>
          Unlocking potential. Your partner in 
        </p>
        <p className={alegreya.className}>
          cultivating your child’s
          educational journey.
        </p>
       <button className="getStarted-btn font-jsMath">GET STARTED</button>
        
      </div>
    </section>
  );
}


