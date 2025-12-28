import Image from "next/image";
import animalsImage from "../pages/public/GroupAnimals.png";
import cloudsImage from "../pages/public/Clouds.png";
import { Alfa_Slab_One, Alegreya } from "next/font/google";

const alfaSlab = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
});

const alegreya = Alegreya({
  weight: ["400", "500"],
  subsets: ["latin"],
});

export default function ScrollThree() {
  return (
    <section className="scroll3-section">
      <div className="scroll3-row">

        {/* LEFT: Text */}
        <div className="scroll3-text">
          <h1 className={`${alfaSlab.className} scroll3-heading`}>
            free. fun. effective !
          </h1>

          <p className={`${alegreya.className} scroll3-para`}>
            With a safe, colorful, and engaging experience, we turn screen time
            into smart time, helping young learners enjoy learning while
            building strong foundations.
          </p>
        </div>

        {/* RIGHT: Image */}
        <div className="scroll3-image">
          <Image
            src={animalsImage}
            alt="Group of friendly animals"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>

      {/* ✅ CLOUDS MUST BE OUTSIDE THE ROW */}
      <div className="clouds">
        <Image
          src={cloudsImage}
          alt="Cloud decoration"
          fill
          priority
        />
      </div>
    </section>
  );
}
