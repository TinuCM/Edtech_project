const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

mongoose.model("purchases", purchaseSchema);

