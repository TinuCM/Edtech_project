const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  classnumber: Number,
  parentnumber:Number,
});

    
mongoose.model("edtechusers", userSchema);
