import { useState } from "react";
import { Box, Button } from "@mui/material";
import Image from "next/image";

// Images
import class1 from "./public/Class1.png";
import class2 from "./public/Class2.png";
import class3 from "./public/Class3.png";
import class4 from "./public/Class4.png";
import class5 from "./public/Class5.png";
import sideImage from "./public/animals-reading-story-book-1.png";
import backgroundIcons from "./public/Backgroundicons.png";

export default function Classes() {
  const [selectedClass, setSelectedClass] = useState(null);

  const handleClassClick = (classNumber) => {
    setSelectedClass(classNumber);
  };

  const handleCreateAccount = () => {
    // Handle create account button click
    console.log("Create Account clicked for class:", selectedClass);
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#0B91FF", // Blue background
        backgroundImage: `
          url(${backgroundIcons.src || backgroundIcons}),
          url(${backgroundIcons.src || backgroundIcons}),
          url(${backgroundIcons.src || backgroundIcons})
        `,
        backgroundSize: "auto, auto, auto",
        backgroundPosition: "top left, center, bottom right",
        backgroundRepeat: "repeat, repeat, repeat",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "140px",
          mt: 16, // ⬅️ THIS moves everything down
          mb: 4, // Add bottom margin for spacing
        }}
      >
        {/* LEFT: Classes */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 600,
          }}
        >
          {/* Top row - Class 1 and 2 */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 4, // Space between rows
            }}
          >
            <ClassImage
              img={class1}
              alt="Class 1"
              isSelected={selectedClass === 1}
              onClick={() => handleClassClick(1)}
            />
            <ClassImage
              img={class2}
              alt="Class 2"
              isSelected={selectedClass === 2}
              onClick={() => handleClassClick(2)}
            />
          </Box>

          {/* Bottom row - Class 3, 4, and 5 */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <ClassImage
              img={class3}
              alt="Class 3"
              isSelected={selectedClass === 3}
              onClick={() => handleClassClick(3)}
            />
            <ClassImage
              img={class4}
              alt="Class 4"
              isSelected={selectedClass === 4}
              onClick={() => handleClassClick(4)}
            />
            <ClassImage
              img={class5}
              alt="Class 5"
              isSelected={selectedClass === 5}
              onClick={() => handleClassClick(5)}
            />
          </Box>

          {/* Create Account Button */}
          <Box
            sx={{
              mt: 6,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={handleCreateAccount}
              sx={{
                backgroundColor: "#F0960A",
                color: "white",
                px: 6,
                py: 2,
                borderRadius: "20px",
                textTransform: "none",
                fontSize: "1.2rem",
                fontWeight: 600,
                fontFamily: '"Afacad", sans-serif',
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#FFA500",
                },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Box>

      {/* RIGHT: Decorative image */}
      <Box>
        <Image
          src={sideImage}
          alt="Reading animals"
          width={350}
          height={350}
          priority
        />
      </Box>
      </Box>
    </Box>
  );
}

/* Reusable image component */
function ClassImage({ img, alt, isSelected, onClick }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "relative",
        width: 180,
        height: 150,
        borderRadius: "18px",
        overflow: "hidden",
        cursor: "pointer",
        border: isSelected ? "4px solid #FFD700" : "4px solid transparent",
        backgroundColor: isSelected ? "rgba(255, 215, 0, 0.2)" : "transparent",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: isSelected
            ? "0 8px 16px rgba(255, 215, 0, 0.4)"
            : "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Image src={img} alt={alt} fill style={{ objectFit: "cover" }} />
      {isSelected && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 215, 0, 0.15)",
            pointerEvents: "none",
          }}
        />
      )}
    </Box>
  );
}
