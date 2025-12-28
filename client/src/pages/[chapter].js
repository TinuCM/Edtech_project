import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '../public/logo.png';
import backgroundImage from '../public/Backgroundicons.png';
import { Poppins, Irish_Grover } from 'next/font/google';

const poppins = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

const irishGrover = Irish_Grover({
  weight: '400',
  subsets: ['latin'],
});

export default function LearnPage() {
  const router = useRouter();
  const { class: classNum, chapter } = router.query;
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  // Fetch video data when class and chapter are available
  useEffect(() => {
    if (classNum && chapter) {
      fetchVideoData();
    }
  }, [classNum, chapter]);

  const fetchVideoData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/videos/${classNum}/${chapter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }
      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching video:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load video when data is available
  useEffect(() => {
    if (videoData && videoRef.current) {
      videoRef.current.load();
    }
  }, [videoData]);


  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0B91FF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      overflow: 'hidden'
    }}>
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        transform: 'scale(1.2)'
      }}>
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Header with Logo */}
      <header style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <Image src={logo} alt="Study Pilot Logo" height={45} />
      </header>

      {/* Main content */}
      <div className={poppins.className} style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        width: '100%',
        flex: 1,
        padding: '0 2rem'
      }}>
        {loading && (
          <p style={{ color: 'white', fontSize: '1.2rem', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Loading video...</p>
        )}

        {error && (
          <div style={{ 
            color: '#ff6b6b', 
            fontSize: '1.2rem',
            textAlign: 'center',
            padding: '1rem',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: '8px'
          }}>
            {error}
          </div>
        )}

        {videoData && !loading && (
          <div style={{
            width: '85%',
            maxWidth: '85%',
            height: 'calc(80vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <video
                ref={videoRef}
                controls
                autoPlay
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  objectFit: 'contain'
                }}
              >
                <source src={videoData.videoUrl} type="video/mp4" />
                <source src={videoData.videoUrl} type="audio/mpeg" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <button
        className={irishGrover.className}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#ff8c00',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          padding: '12px 30px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#ff9500';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#ff8c00';
          e.target.style.transform = 'scale(1)';
        }}
      >
        Next
      </button>
    </section>
  );
}


