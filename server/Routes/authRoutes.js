const mongoose = require("mongoose");
const User = mongoose.model("edtechusers");
const jwt = require("jsonwebtoken"); // npm i jsonwebtoken
const sendEmail = require("../utils/sendEmail");

const requireLogin = require("../middleware/requireLogin");

const otpLength = 6;

module.exports = (app) => {

    // Add New User
  app.post("/api/v1/user/add", async (req, res) => {
    const { name, email, password, classno} = req.body;

    try {
      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      userFields = { name, email, password, classno };

      const response = await User.create(userFields);

      res.status(201).json({ message: "User added successfully", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Student Registration
  app.post("/api/v1/student/register", async (req, res) => {
    const { name, email, password, classno } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user fields (classno is optional)
      const userFields = { name, email, password };
      if (classno) {
        userFields.classno = classno;
      }

      const newUser = await User.create(userFields);

      res.status(201).json({ 
        message: "Account created successfully", 
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email
        }
      });
    } catch (error) {
      console.log("Registration error:", error);
      res.status(500).json({ message: error.message });
    }
  });
  // PARENT LOGIN - Generate & Send OTP
  app.post("/api/v1/parent/login", async (req, res) => {
    try {
      const { email } = req.body;

      //   Generate the OTP
      const digits = "0123456789";
      let newOTP = "";
      for (let i = 0; i < otpLength; i++) {
        newOTP += digits[Math.floor(Math.random() * digits.length)];
      }
      console.log("newOTP: ", newOTP);

      //   Check if user already exists
      const user = await User.findOne({ email });

      //   If user does exist
      if (user) {
        await User.updateOne({ email }, {$set:{ otp: newOTP }});
        await sendEmail({
        to: email,
        subject: "Parent Login OTP",
        text: `Your OTP to login as a parent is ${newOTP}.`,
        });
        res.status(200).json({ message: "OTP Sent Successfully" });
      } 
      else {
        // const response = await User.updateOne({ email }, {$set:{ otp: newOTP }});
        res.status(400).json({ message: "ERROR USER NOT FOUND" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });

  // Verify parent
  app.post("/api/v1/verify/parent", async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.otp === otp) {
        const payload = {
          id: user._id,
          email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(200).json({ message: "Parent Login Success", token });
      } else {
        res.status(400).json({ message: "Invalid OTP. Please try again." });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });
  // Student LOGIN
  app.post("/api/v1/student/login", async (req, res) => {
    try {
      const { name, password } = req.body;

      if (!name || !password) {
        return res.status(400).json({ message: "Name and password are required" });
      }

      // First check if user exists by name
      const user = await User.findOne({ name });

      if (!user) {
        return res.status(401).json({ message: "User not found. Please create an account first." });
      }

      // Then check if password matches
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password. Please try again." });
      }

      const payload = {
        id: user._id,
        name: user.name,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.status(200).json({ message: "Student Login Success", token });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });

};