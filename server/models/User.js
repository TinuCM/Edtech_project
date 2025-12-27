const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  classno: Number,
  otp:Number
  
});

    
mongoose.model("edtechusers", userSchema);
