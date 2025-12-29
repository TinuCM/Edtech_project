const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Chapters = mongoose.model("chapters");
const UserSubject = mongoose.model("usersubjects");

module.exports = (app) => {
  // Add New Chapter
  app.post("/api/v1/chapters/add", async (req, res) => {
    const { subjectId, name, description, videourl } = req.body;

    try {
      const chapters = await Chapters.findOne({ name, subjectId });
      if (chapters) {
        return res.status(400).json({ message: "Chapter already exists for this subject" });
      }
      chapterFields = { subjectId, name, description, videourl };

      const response = await Chapters.create(chapterFields);

      res.status(201).json({ message: "Chapter added successfully", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get All Chapters
  app.get("/api/v1/chapters/all/get", async (req, res) => {
    try {
      const chapters = await Chapters.find();

      if (!chapters) {
        return res.status(400).json({ message: "There are no chapters." });
      }

      res.status(200).json({ message: "Chapters: ", chapters });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get Chapters by Subject (checks if subject is unlocked)
  app.get("/api/v1/chapters/by-subject/:subjectId", requireLogin, async (req, res) => {
    const { subjectId } = req.params;
    const userId = req.user._id;

    try {
      // Check if subject is unlocked for this user
      const userSubject = await UserSubject.findOne({ userId, subjectId });

      if (!userSubject || userSubject.locked) {
        return res.status(403).json({ 
          message: "Subject is locked. Please purchase to access chapters.",
          locked: true
        });
      }

      // Subject is unlocked, return chapters
      const chapters = await Chapters.find({ subjectId });

      if (!chapters || chapters.length === 0) {
        return res.status(404).json({ message: "No chapters found for this subject" });
      }

      res.status(200).json({ 
        message: "Chapters retrieved successfully", 
        chapters,
        locked: false
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get Single Chapter (checks if subject is unlocked)
  app.get("/api/v1/chapters/:chapterId", requireLogin, async (req, res) => {
    const { chapterId } = req.params;
    const userId = req.user._id;

    try {
      const chapter = await Chapters.findById(chapterId);
      
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      // Check if the subject this chapter belongs to is unlocked
      const userSubject = await UserSubject.findOne({ 
        userId, 
        subjectId: chapter.subjectId 
      });

      if (!userSubject || userSubject.locked) {
        return res.status(403).json({ 
          message: "Subject is locked. Please purchase to access this chapter.",
          locked: true
        });
      }

      res.status(200).json({ 
        message: "Chapter retrieved successfully", 
        chapter,
        locked: false
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Update Chapter
  app.put("/api/v1/chapters/update/:chapterId", async (req, res) => {
    const { chapterId } = req.params;
    const { name, description, videourl } = req.body;

    try {
      const chapter = await Chapters.findById(chapterId);
      
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      if (name) chapter.name = name;
      if (description) chapter.description = description;
      if (videourl) chapter.videourl = videourl;

      await chapter.save();

      res.status(200).json({ 
        message: "Chapter updated successfully", 
        chapter 
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Delete Chapter
  app.delete("/api/v1/chapters/delete/:chapterId", async (req, res) => {
    const { chapterId } = req.params;

    try {
      const chapter = await Chapters.findByIdAndDelete(chapterId);
      
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      res.status(200).json({ 
        message: "Chapter deleted successfully", 
        chapter 
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
};