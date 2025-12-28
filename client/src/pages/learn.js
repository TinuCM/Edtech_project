import { useRouter } from "next/router";
import Image from "next/image";
import styles from "../styles/Learn.module.css";
import logo from "./public/logo.png";

const VIDEO_MAP = {
  "1-one": "d0yGdNEWdn0",
};

export default function Learn() {
  const router = useRouter();
  const { class: cls, chapter } = router.query;

  if (!cls || !chapter) {
    return (
      <p style={{ color: "white", padding: 20 }}>
        No class or chapter selected
      </p>
    );
  }

  const videoId = VIDEO_MAP[`${cls}-${chapter}`];

  if (!videoId) {
    return <p style={{ color: "white" }}>Video not found</p>;
  }

  return (
    <div className={styles.learnPage}>

        <div className="navbar-logo">
          <Image src={logo} alt="Study Pilot Logo" height={45} />
        </div>



      <div className={styles.videoContainer}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Learning Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <button className={styles.nextBtn}>
  Next
</button>

    </div>
  );
}
