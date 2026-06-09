const Expense = require("../models/Expense");

// Create Expense
const createExpense = async (req, res) => {
  try {
    const { title, amount, category, description } =
      req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      description,
      mobNo: req.user.mobNo,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      mobNo: req.user.mobNo,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Expense for put
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Check ownership
    if (expense.mobNo !== req.user.mobNo) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedExpense,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (expense.mobNo !== req.user.mobNo) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Expense Summary
const getSummary = async (req, res) => {
  try {

    const expenses = await Expense.find({
      mobNo: req.user.mobNo,
    });

    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const categoryWise = {};

    expenses.forEach((expense) => {
      if (!categoryWise[expense.category]) {
        categoryWise[expense.category] = 0;
      }

      categoryWise[expense.category] += expense.amount;
    });

    res.status(200).json({
      success: true,
      totalRecords: expenses.length,
      totalExpenses,
      categoryWise,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getSummary,
};