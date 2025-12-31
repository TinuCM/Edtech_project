import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Cookies } from "react-cookie";
import Head from "next/head";
import AuthFrame from "../components/common/AuthFrame";
import { Box, Card, CardContent, Typography, Chip, Button } from "@mui/material";
import { Poppins } from "next/font/google";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import CardMembershipIcon from "@mui/icons-material/CardMembership";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const cookies = new Cookies();

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState("trial");
  const [selectedChildName, setSelectedChildName] = useState("");
  const [selectedChildId, setSelectedChildId] = useState("");
  const [selectedChildClass, setSelectedChildClass] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Read cookies only on client side to avoid hydration mismatch
    const childId = cookies.get("selectedChildId");
    const childName = cookies.get("selectedChildName");
    const childClass = cookies.get("selectedChildClass");
    const authToken = cookies.get("token");
    const parentEmail = cookies.get("parentEmail");

    setSelectedChildId(childId || "");
    setSelectedChildName(childName || "");
    setSelectedChildClass(childClass || "");
    setToken(authToken || "");

    if (!childId || !authToken || !childClass) {
      router.push("/profiles");
      return;
    }
    
    fetchSubjects(childId, childClass, authToken);
    fetchSubscriptionStatus(authToken);
  }, [router]);

  const fetchSubjects = async (childId, childClass, authToken) => {
    try {
      setLoading(true);
      // Get subjects for this child's class (class number is already in cookies)
      const response = await axios.get(`/api/v1/subject/by-class/${childClass}`, {
        params: {
          childId: childId
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        setSubjects(response.data.subjects || []);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      if (error.response && error.response.status === 401) {
        cookies.remove("token");
        router.push("/parentlogin");
      } else if (error.response && error.response.status === 404) {
        // No subjects found for this class
        setSubjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionStatus = async (authToken) => {
    try {
      const response = await axios.get("/api/v1/parent/subscription", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        setSubscriptionStatus(response.data.status || "trial");
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
  };

  const handleSubjectClick = (subject) => {
    // First chapter is always free, so allow access
    cookies.set("selectedSubjectId", subject._id, { path: "/", maxAge: 30 * 24 * 60 * 60 });
    cookies.set("selectedSubjectName", subject.name, { path: "/", maxAge: 30 * 24 * 60 * 60 });
    router.push(`/chapters?subjectId=${subject._id}`);
  };

  return (
    <>
      <Head>
        <title>Subjects{selectedChildName ? ` - ${selectedChildName}` : ""}</title>
        <meta name="description" content="Select a subject" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthFrame showBack={true}>
        <Box
          sx={{
            width: "100%",
            padding: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              marginBottom: 4,
            }}
          >
            <Typography
              className={poppins.className}
              sx={{
                fontSize: { xs: "28px", md: "36px" },
                fontWeight: "700",
                color: "#000000",
                marginBottom: 1,
              }}
            >
              Choose a Subject
            </Typography>
            {selectedChildName && (
              <Typography
                className={poppins.className}
                sx={{
                  fontSize: "16px",
                  color: "#666666",
                }}
              >
                {selectedChildName}
              </Typography>
            )}
          </Box>

          {loading ? (
            <Typography className={poppins.className}>Loading subjects...</Typography>
          ) : subjects.length === 0 ? (
            <Card
              sx={{
                padding: 4,
                textAlign: "center",
                backgroundColor: "#F5F5F5",
              }}
            >
              <Typography className={poppins.className} sx={{ color: "#666666" }}>
                No subjects found for this class.
              </Typography>
            </Card>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {subjects.map((subject) => {
                const isUnlocked = !subject.locked || subscriptionStatus === "active";
                
                return (
                  <Card
                    key={subject._id}
                    onClick={() => handleSubjectClick(subject)}
                    sx={{
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      opacity: isUnlocked ? 1 : 0.7,
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": isUnlocked ? {
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                      } : {},
                      border: isUnlocked ? "1px solid #E0E0E0" : "2px solid #CCCCCC",
                    }}
                  >
                    <CardContent sx={{ padding: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "12px",
                            backgroundColor: "#E3F2FD",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "30px",
                            fontWeight: "600",
                          }}
                        >
                          {subject.name.charAt(0)}
                        </Box>
                        {isUnlocked ? (
                          <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 24 }} />
                        ) : (
                          <LockIcon sx={{ color: "#999999", fontSize: 24 }} />
                        )}
                      </Box>
                      <Typography
                        className={poppins.className}
                        sx={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#000000",
                          marginBottom: 1,
                        }}
                      >
                        {subject.name}
                      </Typography>
                      {!isUnlocked && subscriptionStatus !== "active" && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push("/subscription");
                          }}
                          variant="contained"
                          startIcon={<CardMembershipIcon />}
                          fullWidth
                          sx={{
                            marginTop: 2,
                            backgroundColor: "#0B91FF",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "#0A7FD9",
                            },
                          }}
                        >
                          Subscribe to Unlock
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      </AuthFrame>
    </>
  );
}

