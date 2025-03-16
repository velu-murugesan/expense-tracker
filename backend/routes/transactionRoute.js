const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Transaction } = require("../models/transactionModel.js");
const { User } = require("../models/userModel.js");
router.use(express.json());

// Welcome route
router.get("/", async (req, res) => {
  res.send("Welcome to the transaction route");
});

// Add a transaction
router.post("/:userId", async (req, res) => {
  try {
    const { amount, date, type, description, category, title } = req.body;
    const userId = req.params.userId;
    
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const transaction = new Transaction({
      amount,
      date,
      type,
      description,
      category,
      user: userId,
      title,
    });

    await transaction.save();
    await User.findByIdAndUpdate(userId, { $push: { transactions: transaction._id } }, { new: true });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all transactions for a user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await Transaction.find({ user: userId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

// Update a transaction
router.put("/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { title, amount, category, date, type, description } = req.body;

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { title, amount, category, date, type, description },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a transaction
router.delete("/:transactionId", async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    await Transaction.findByIdAndDelete(transactionId);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get transactions for the current month
router.get("/monthly/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: firstDay, $lte: lastDay },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get used income categories for a user
router.get("/:userId/used-income-categories", async (req, res) => {
  try {
    const { userId } = req.params;
    const categories = await Transaction.find({ user: userId, type: "income" }).distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income categories" });
  }
});

// Add a transaction (alternative endpoint)
router.post("/add", async (req, res) => {
  try {
    const { userId, amount, category, type, date } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const newTransaction = new Transaction({ user: userId, amount, category, type, date });
    await newTransaction.save();
    res.json({ message: "Transaction added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding transaction" });
  }
});

// Add salary transaction for the current month
router.post("/add-salary", async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const existingSalary = await Transaction.findOne({
      user: userId,
      category: "Salary",
      date: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    if (existingSalary) {
      return res.status(400).json({ message: "Salary already added this month!" });
    }

    const newSalaryTransaction = new Transaction({
      user: userId,
      title: "Salary",
      amount,
      type: "income",
      category: "Salary",
      date: new Date(),
    });

    await newSalaryTransaction.save();
    res.json({ message: "Salary added successfully!", transaction: newSalaryTransaction });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
