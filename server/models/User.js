const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  classno: Number,
  otp:String
  
});

    
mongoose.model("edtechusers", userSchema);
