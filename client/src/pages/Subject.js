// src/pages/subject.js
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Cookies } from 'react-cookie';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LanguageIcon from '@mui/icons-material/Language';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BrushIcon from '@mui/icons-material/Brush';

/* ---------- Images (public) ---------- */
const DEFAULT_IMG = '/Confused_Cute_Dog.gif';
const MATH_IMG = '/dog-math.png';
const SCIENCE_IMG = '/Science_gif.gif';
const ENGLISH_IMG = '/dog-english.png';
const ARTS_IMG = '/art_craft.gif';
const AVATAR_IMG = '/avatar.png';




/* ---------- Subject Card ---------- */
function SubjectCard({
  title,
  subtitle,
  icon,
  bg,
  accent,
  onClick,
  onHover,
  onLeave,
}) {
  return (
    <Card
      elevation={0}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      sx={{
        bgcolor: bg,
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.06)',
        height: 140,
        p: 1.25,
        cursor: 'pointer',
        position: 'relative',
        '&:hover': { boxShadow: 4 },
      }}
    >
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: 6,
          right: 6,
          bgcolor: '#fff',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>

      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: accent, width: 44, height: 44 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography fontWeight={700}>{title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

const cookies = new Cookies();

/* ---------- Page ---------- */
export default function SubjectPage() {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(DEFAULT_IMG);

  useEffect(() => {
    // Check if user is logged in
    const token = cookies.get("token");
    const selectedChildId = cookies.get("selectedChildId");
    const selectedChildClass = cookies.get("selectedChildClass");
    if (!token || !selectedChildId || !selectedChildClass) {
      router.push("/profiles");
    }
  }, [router]);

  const subjects = [
    {
      title: 'Mathematics',
      subtitle: 'Number puzzles & fun',
      slug: 'math',
      bg: '#E9ECFF',
      accent: '#7788F8',
      icon: <CalculateIcon />,
      image: MATH_IMG,
    },
    {
      title: 'Science',
      subtitle: "Discover nature's secrets",
      slug: 'science',
      bg: '#E7FAF0',
      accent: '#54C08A',
      icon: <ScienceIcon />,
      image: SCIENCE_IMG,
    },
    {
      title: 'English',
      subtitle: 'Stories & reading',
      slug: 'english',
      bg: '#FBE6EF',
      accent: '#F06AAE',
      icon: <MenuBookIcon />,
      image: ENGLISH_IMG,
    },
    {
      title: 'Arts & Creativity',
      subtitle: 'Draw & paint',
      slug: 'arts',
      bg: '#FFF4DD',
      accent: '#FFB74D',
      icon: <BrushIcon />,
      image: ARTS_IMG,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#1EA0FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="lg" sx={{ bgcolor: '#fff', borderRadius: 4, boxShadow: 6, p: 3 }}>
        {/* Header */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={() => router.back()}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <Typography fontWeight={700}>Study Pilot</Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ position: 'absolute', right: 48, top: 0 }}>
            <Tooltip title="Leaderboard">
              <IconButton size="small"><EmojiEventsIcon fontSize="small" /></IconButton>
            </Tooltip>
            <Tooltip title="Language">
              <IconButton size="small"><LanguageIcon fontSize="small" /></IconButton>
            </Tooltip>
          </Stack>

          <Avatar src={AVATAR_IMG} sx={{ position: 'absolute', right: 0, top: 0 }} />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="h4" fontWeight={800}>
          Explore your Subjects!
        </Typography>
        <Typography color="text.secondary" mb={2}>
          Pick a world to start your adventure.
        </Typography>

        {/* Main Content */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '7fr 5fr',
            gap: 2,
            alignItems: 'stretch',
          }}
        >
          {/* LEFT: Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
            }}
          >
            {subjects.map((s) => (
              <SubjectCard
                key={s.slug}
                {...s}
                onHover={() => setActiveImage(s.image)}
                onLeave={() => setActiveImage(DEFAULT_IMG)}
                onClick={() => {
                  // Store subject info in cookies and route to chapters
                  const selectedChildClass = cookies.get("selectedChildClass");
                  const selectedChildId = cookies.get("selectedChildId");
                  
                  if (!selectedChildId || !selectedChildClass) {
                    console.error("Child ID or Class not found. Redirecting to profiles.");
                    router.push("/profiles");
                    return;
                  }
                  
                  cookies.set("selectedSubjectName", s.title, { path: "/", maxAge: 30 * 24 * 60 * 60 });
                  cookies.set("selectedSubjectSlug", s.slug, { path: "/", maxAge: 30 * 24 * 60 * 60 });
                  
                  // Ensure child class is still set
                  cookies.set("selectedChildClass", selectedChildClass, { path: "/", maxAge: 30 * 24 * 60 * 60 });
                  
                  console.log("Redirecting to chapters with:", {
                    subject: s.title,
                    childClass: selectedChildClass,
                    childId: selectedChildId
                  });
                  
                  router.push("/chapters");
                }}
              />
            ))}
          </Box>

          {/* RIGHT: Image (height locked to cards) */}
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >


            <Card
              elevation={0}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#F8FBFF',
                borderRadius: 5,
              }}
            >
              <Box
  sx={{
    width: 300,
    height: 300,
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: 'transparent',
  }}
>
  <CardMedia
    component="img"
    image={activeImage}
    alt="Subject helper"
    sx={{
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      borderRadius: '10px',
    }}
  />
</Box>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
