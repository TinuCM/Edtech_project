const mongoose = require("mongoose");
const Subjects = mongoose.model("subjects");

module.exports = (app) => {
  // Add New Subject
  app.post("/api/v1/subject/add", async (req, res) => {
    const { classnumber,name } = req.body;

    try {
      const subject = await Subjects.findOne({ name });
      if (subject) {
        return res.status(400).json({ message: "Subject already exists" });
      }

      subjectFields = { classnumber, name };

      const response = await Subjects.create(subjectFields);

      res.status(201).json({ message: "Subject added successfully", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get All Subjects
    app.get("/api/v1/subject/all/get", async (req, res) => {
    try {
      const subjects = await Subjects.find();

      if (!subjects) {
        return res.status(400).json({ message: "There are no subjects." });
      }

      res.status(201).json({ message: "Subjects: ", subjects });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
};