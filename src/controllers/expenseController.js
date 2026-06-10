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

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Validation
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    const skip = (page - 1) * limit;

    const filter = {
      mobNo: req.user.mobNo,
    };

    // Category Filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Search
    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    // Sorting
    let sortOption = { createdAt: -1 };

    switch (req.query.sort) {
      case "latest":
        sortOption = { createdAt: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "amount_asc":
        sortOption = { amount: 1 };
        break;

      case "amount_desc":
        sortOption = { amount: -1 };
        break;
    }

    const expenses = await Expense.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(filter);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      data: expenses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Monthly Summary
const getMonthlySummary = async (req, res) => {
  try {

    const summary = await Expense.aggregate([
      {
        $match: {
          mobNo: req.user.mobNo,
        },
      },

      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt",
            },
            year: {
              $year: "$createdAt",
            },
          },

          totalAmount: {
            $sum: "$amount",
          },

          totalExpenses: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,

          month: {
            $arrayElemAt: [
              [
                "",
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ],
              "$_id.month",
            ],
          },

          year: "$_id.year",

          totalAmount: 1,

          totalExpenses: 1,
        },
      },

      {
        $sort: {
          year: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: summary,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getCategorySummary
const getCategorySummary = async (req, res) => {
  try {

    const summary = await Expense.aggregate([
      {
        $match: {
          mobNo: req.user.mobNo,
        },
      },

      {
        $group: {
          _id: "$category",

          totalAmount: {
            $sum: "$amount",
          },

          totalExpenses: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
          totalExpenses: 1,
        },
      },

      {
        $sort: {
          totalAmount: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: summary,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//DateSummary
const getDateRangeSummary = async (
  req,
  res
) => {
  try {

    const {
      startDate,
      endDate,
    } = req.query;

    const expenses =
      await Expense.find({
        mobNo: req.user.mobNo,

        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      });

    const totalAmount =
      expenses.reduce(
        (sum, item) =>
          sum + item.amount,
        0
      );

    res.status(200).json({
      success: true,
      totalExpenses:
        expenses.length,
      totalAmount,
      data: expenses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//5HighestExpenses
const getTopExpenses = async (
  req,
  res
) => {
  try {

    const expenses =
      await Expense.find({
        mobNo: req.user.mobNo,
      })
        .sort({
          amount: -1,
        })
        .limit(5);

    res.status(200).json({
      success: true,
      data: expenses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Dashboard
const getDashboard = async (
  req,
  res
) => {
  try {

    const expenses =
      await Expense.find({
        mobNo: req.user.mobNo,
      });

    const totalAmount =
      expenses.reduce(
        (sum, expense) =>
          sum + expense.amount,
        0
      );

    const highestExpense =
      expenses.length
        ? Math.max(
            ...expenses.map(
              (e) => e.amount
            )
          )
        : 0;

    res.status(200).json({
      success: true,

      totalExpenses:
        expenses.length,

      totalAmount,

      highestExpense,

      averageExpense:
        expenses.length
          ? Number(
              (
                totalAmount /
                expenses.length
              ).toFixed(2)
            )
          : 0,
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
  getMonthlySummary,
  getCategorySummary,
  getDateRangeSummary,
  getTopExpenses,
  getDashboard,
};