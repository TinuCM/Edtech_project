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
  // PARENT LOGIN - Generate & Send OTP
  app.post("/api/v1/parent/login", async (req, res) => {
    try {
      const { email } = req.body;

      //   Generate the OTP
      const digits = "123456789";
      let newOTP = "";
      for (let i = 0; i < otpLength; i++) {
        newOTP += digits[Math.floor(Math.random() * 10)];
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
    // console.log("Verify OTP 1");
    try {
      const { email, otp } = req.body;
      // console.log("Verify OTP 2", email, otp);

      const user = await User.findOne({ email });
      // console.log("Verify OTP 3", user);

      if (user && user.otp === otp) {
        const payload = {
          id: user._id,
          email: user.email,
        };
        // console.log("Verify OTP 4");

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        // console.log("Verify OTP 5");

        res.status(200).json({ message: " Parent Login Success", token });
        // console.log("Verify OTP 6");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });
  // Student LOGIN
  app.post("/api/v1/student/login", async (req, res) => {
    // console.log("Verify OTP 1");
    try {
      const { name,password } = req.body;
      // console.log("Verify OTP 2", email, otp);

      const user = await User.findOne({ name, password });
      // console.log("Verify OTP 3", user);


        const payload = {
          id: user._id,
          name: user.name,
          // password: user.password,
        };
        // console.log("Verify OTP 4");

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        // console.log("Verify OTP 5");

        res.status(200).json({ message: "Student Login Success", token });
        // console.log("Verify OTP 6");
      
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: error.message });
    }
  });

};