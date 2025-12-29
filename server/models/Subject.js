const mongoose = require("mongoose");
const { Schema } = mongoose;


const subjectSchema = new mongoose.Schema({
  classnumber: Number,
  name: String,
  price: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});


mongoose.model("subjects", subjectSchema);