const express = require("express");

const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
} = require("../controllers/expenseController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createExpense);

router.get("/", protect, getExpenses);

router.get("/summary", protect, getSummary);

router.put("/:id", protect, updateExpense);

router.delete("/:id", protect, deleteExpense);

module.exports = router;