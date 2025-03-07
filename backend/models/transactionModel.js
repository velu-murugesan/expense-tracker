const mongoose = require("mongoose");
const { Schema } = mongoose;
const transactionSchema = new Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  description: { type: String },
  category: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "User",required: true },
  title: { type: String },
  receipt: { type: String },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = { Transaction };
