const mongoose = require("mongoose");
const { Schema } = mongoose;

// This model represents the relationship between a user and a subject
// It tracks whether a subject is locked or unlocked for a specific user
const userSubjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'edtechusers',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subjects',
    required: true
  },
  locked: {
    type: Boolean,
    default: true // All subjects are locked by default
  },
  purchaseDate: {
    type: Date
  },
  transactionId: {
    type: String
  },
  orderId: {
    type: String
  },
  amount: {
    type: Number
  }
}, {
  timestamps: true
});

// Ensure a user can't have duplicate subject entries
userSubjectSchema.index({ userId: 1, subjectId: 1 }, { unique: true });

mongoose.model("usersubjects", userSubjectSchema);

