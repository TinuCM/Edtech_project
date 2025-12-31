const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  classno: Number,
  otp: String,
  emoji: String,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'edtechusers',
    default: null
  },
  isParent: {
    type: Boolean,
    default: false
  },
  subscriptionStatus: {
    type: String,
    enum: ['trial', 'active', 'expired'],
    default: 'trial'
  },
  subscriptionType: {
    type: String,
    enum: ['monthly', 'yearly', null],
    default: null
  },
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  lastActivityTime: Date
});

    
mongoose.model("edtechusers", userSchema);
