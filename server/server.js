const express = require("express"); // npm i express
const mongoose = require("mongoose"); // npm i mongoose
require("dotenv").config(); // Load environment variables. Make sure .env is in .gitignore

const port = process.env.PORT || 5001;

const app = express();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// Models
// require("./models/Movie");
require("./Models/User");
require("./Models/Subject");
require("./Models/Chapter");
require("./Models/Progress");
require("./Models/QuizScore");
require("./Models/QuizQuestions");
require("./Models/Leaderboard");
require("./Models/UserSubject");


// Routes

require("./Routes/authRoutes")(app); // Authentication BackEnd
require("./Routes/chaptersRoutes")(app); // Chapters BackEnd
require("./Routes/subjectRoutes")(app); // Subject BackEnd
require("./Routes/paymentRoutes")(app); // Payment BackEnd
require("./Routes/quizRoutes")(app); // Quiz BackEnd

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});