const express = require("express");
const Salary = require("../models/salaryModel");

const router = express.Router();

// Check if salary is already added for the current month
router.get("/check-salary/:userId", async (req, res) => {
  const { userId } = req.params;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  try {
    const existingSalary = await Salary.findOne({
      userId,
      date: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    res.json({ alreadyAdded: !!existingSalary });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add salary (only if not already added for this month)
router.post("/add-salary", async (req, res) => {
  const { userId, amount } = req.body;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  try {
    const existingSalary = await Salary.findOne({
      userId,
      date: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    if (existingSalary) {
      return res.status(400).json({ message: "Salary already added this month!" });
    }

    const newSalary = new Salary({ userId, amount });
    await newSalary.save();

    res.json({ message: "Salary added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
