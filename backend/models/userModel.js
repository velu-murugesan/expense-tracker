const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
  expenseCategories: [{ type: String }],
  incomeCategories: [{ type: String }],
  basicSalary: { type: Number, default: null },
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
