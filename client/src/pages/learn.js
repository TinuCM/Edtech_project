import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Irish_Grover } from "next/font/google";
import styles from "../styles/Learn.module.css";
import logo from "../../public/logo.png";
import blackLogo from "../../public/Black logo (1).png";
 
const irishGrover = Irish_Grover({
  weight: "400",
  subsets: ["latin"],
});
 
export default function Learn() {
  const router = useRouter();
  const { class: cls, chapter } = router.query;
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
 
  useEffect(() => {
    const fetchChapter = async () => {
      // Wait for router to be ready
      if (!router.isReady) {
        return;
      }
 
      if (!chapter) {
        setLoading(false);
        setError("No chapter ID provided");
        return;
      }
 
      try {
        setLoading(true);
        setError(null);
       
        // Handle chapter ID - could be string or array
        let chapterId = chapter;
        if (Array.isArray(chapter)) {
          chapterId = chapter[0];
        }
        chapterId = String(chapterId).trim();
       
        console.log("Fetching chapter with ID:", chapterId);
        console.log("Chapter ID length:", chapterId.length);
        console.log("Chapter ID type:", typeof chapterId);
       
        // Validate format before making request
        if (chapterId.length !== 24) {
          setError(`Invalid chapter ID format. Expected 24 characters, got ${chapterId.length}. ID: ${chapterId}`);
          setLoading(false);
          return;
        }
       
        // Try direct backend URL first, then fallback to proxy
        const apiUrl = `http://localhost:5001/api/v1/chapters/${chapterId}`;
        console.log("API URL:", apiUrl);
        console.log("Chapter ID being used:", chapterId);
        console.log("Chapter ID type:", typeof chapterId);
        console.log("Chapter ID length:", chapterId.length);
       
        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data);
       
        if (response.data && response.data.chapter) {
          setChapterData(response.data.chapter);
          // Construct video URL from backend
          if (response.data.chapter.videourl) {
            const baseUrl = "http://localhost:5001";
            const videoPath = response.data.chapter.videourl.startsWith("videos/")
              ? response.data.chapter.videourl
              : `videos/${response.data.chapter.videourl}`;
            const fullVideoUrl = `${baseUrl}/uploads/${videoPath}`;
            console.log("Video URL:", fullVideoUrl);
            setVideoUrl(fullVideoUrl);
          } else {
            setError("No video URL found for this chapter");
          }
        } else {
          setError("Chapter not found in response");
        }
      } catch (err) {
        console.error("Error fetching chapter:", err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);
        console.error("Full error:", err);
       
        if (err.response?.status === 404) {
          const availableChapters = err.response?.data?.availableChapters;
          let errorMsg = `Chapter not found in database. ID: ${chapterId}`;
          if (availableChapters && availableChapters.length > 0) {
            errorMsg += `\n\nAvailable chapters:\n${availableChapters.map(ch => `- ${ch.name} (ID: ${ch.id})`).join('\n')}`;
          }
          setError(errorMsg);
        } else {
          const errorMessage = err.response?.data?.message || err.message || "Failed to load chapter";
          const errorDetails = err.response?.data?.received ?
            `Received: "${err.response.data.received}" (length: ${err.response.data.received?.length})` : "";
          setError(`${errorMessage} ${errorDetails}`);
        }
      } finally {
        setLoading(false);
      }
    };
 
    fetchChapter();
  }, [chapter, router.isReady]);
 
  if (!cls || !chapter) {
    return (
      <p style={{ color: "white", padding: 20 }}>
        No class or chapter selected
      </p>
    );
  }
 
  return (
    <div className={styles.learnPage}>
      {/* Logo and Back Button - Top Left */}
      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <div style={{ marginBottom: "4px" }}>
          <Image src={blackLogo} alt="Study Pilot Logo" height={25} />
        </div>
        <Link href="/classes">
          <button
            style={{
              background: "none",
              border: "none",
              fontSize: "30px",
              cursor: "pointer",
              color: "#000",
              padding: "8px",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
            }}
          >
            ←
          </button>
        </Link>
      </div>
 
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            color: "white",
            fontSize: "18px",
          }}
        >
          Loading chapter...
        </div>
      )}
 
      {error && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            color: "red",
            fontSize: "18px",
            padding: 20,
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: 20 }}>{error}</div>
          <div style={{ fontSize: "14px", color: "#666", marginTop: 10 }}>
            Chapter ID used: {chapter}
          </div>
          <div style={{ fontSize: "12px", color: "#999", marginTop: 10 }}>
            To verify chapters exist, check: GET http://localhost:5001/api/v1/chapters/all/get
          </div>
        </div>
      )}
 
      {!loading && !error && videoUrl && (
        <div className={styles.videoContainer}>
          <video
            key={videoUrl}
            controls
            autoPlay
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "12px",
              objectFit: "contain",
              backgroundColor: "#000",
            }}
            onError={(e) => {
              console.error("Video error:", e);
              setError("Failed to load video. Please check the video URL.");
            }}
            onLoadStart={() => {
              console.log("Video loading started:", videoUrl);
            }}
            onCanPlay={() => {
              console.log("Video can play");
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            <source src={videoUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
 
      {!loading && !error && !videoUrl && chapterData && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            color: "white",
            fontSize: "18px",
          }}
        >
          No video available for this chapter
        </div>
      )}
      <button className={`${styles.nextBtn} ${irishGrover.className}`}>
  Next
</button>
 
    </div>
  );
}
