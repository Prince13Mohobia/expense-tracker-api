const Expense = require("../models/Expense");
const fs = require("fs");
const path = require("path");

// Create Expense
const createExpense = async (req, res, next) => {
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
  next(error);
}
};

// Get All Expenses
const getExpenses = async (req, res, next) => {
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
  next(error);
}
};

// Monthly Summary
const getMonthlySummary = async (req, res, next) => {
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
  next(error);
}
};

//getCategorySummary
const getCategorySummary = async (req, res, next) => {
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
  next(error);
}
};

//DateSummary
const getDateRangeSummary = async (
  req,
  res,
  next
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
  next(error);
}
};

//5HighestExpenses
const getTopExpenses = async (
  req,
  res,
  next
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
  next(error);
}
};

//Dashboard
const getDashboard = async (
  req,
  res,
  next
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
  next(error);
}
};


// Update Expense for put
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {

  const error = new Error(
    "Expense not found"
  );

  error.statusCode = 404;

  return next(error);
}

    // Check ownership
if (expense.mobNo !== req.user.mobNo) {

  const error = new Error(
    "Access denied"
  );

  error.statusCode = 403;

  return next(error);
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
  next(error);
}
};

// Delete Expense
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {

  const error = new Error(
    "Expense not found"
  );

  error.statusCode = 404;

  return next(error);
}

   if (expense.mobNo !== req.user.mobNo) {

  const error = new Error(
    "Access denied"
  );

  error.statusCode = 403;

  return next(error);
}

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });

  } catch (error) {
  next(error);
}
};

// Expense Summary
const getSummary = async (req, res, next) => {
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
  next(error);
}
};

const { Parser } = require("json2csv");

const exportExpensesCSV = async (
  req,
  res,
  next
) => {
  try {

    const expenses =
      await Expense.find({
        mobNo: req.user.mobNo,
      });

    if (!expenses.length) {

      const error = new Error(
        "No expenses found"
      );

      error.statusCode = 404;

      return next(error);
    }

    const fields = [
      "title",
      "amount",
      "category",
      "description",
      "createdAt",
    ];

    const parser =
      new Parser({
        fields,
      });

    const csv =
      parser.parse(expenses);

    const uploadsDir =
      path.join(
        __dirname,
        "../../uploads"
      );

    if (
      !fs.existsSync(
        uploadsDir
      )
    ) {
      fs.mkdirSync(
        uploadsDir,
        {
          recursive: true,
        }
      );
    }

    const fileName =
      `expense-${req.user.mobNo}.csv`;

    const filePath =
      path.join(
        uploadsDir,
        fileName
      );

    fs.writeFileSync(
      filePath,
      csv
    );

    const fileUrl =
      `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

    res.status(200).json({
      success: true,
      fileUrl,
    });

  } catch (error) {

    next(error);

  }
};

const exportExpensesExcel = async (
  req,
  res,
  next
) => {
  try {

    const expenses =
      await Expense.find({
        mobNo: req.user.mobNo,
      });

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Expenses"
      );

    worksheet.columns = [
      {
        header: "Title",
        key: "title",
        width: 25,
      },
      {
        header: "Amount",
        key: "amount",
        width: 15,
      },
      {
        header: "Category",
        key: "category",
        width: 20,
      },
      {
        header: "Description",
        key: "description",
        width: 30,
      },
      {
        header: "Created At",
        key: "createdAt",
        width: 25,
      },
    ];

    expenses.forEach((expense) => {
      worksheet.addRow({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        description:
          expense.description,
        createdAt:
          expense.createdAt,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expenses.xlsx"
    );

const uploadsDir = path.join(
  __dirname,
  "../../uploads"
);

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(
    uploadsDir,
    { recursive: true }
  );
}

    const fileName =
      `expense-${req.user.mobNo}.xlsx`;

    const filePath = path.join(
      uploadsDir,
      fileName
    );

    await workbook.xlsx.writeFile(
      filePath
    );

    const excelUrl =
      `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

    res.status(200).json({
      success: true,
      excelUrl,
    });

  } catch (error) {
  next(error);
}
};

const exportExpensesPDF = async (
  req,
  res,
  next
) => {
  try {

    const expenses =
      await Expense.find({
        mobNo: req.user.mobNo,
      });

    const uploadsDir = path.join(
      __dirname,
      "../../uploads"
    );

    if (
      !fs.existsSync(
        uploadsDir
      )
    ) {
      fs.mkdirSync(
        uploadsDir
      );
    }

    const fileName =
  `expense-${req.user.mobNo}.pdf`;

    const filePath = path.join(
      uploadsDir,
      fileName
    );

    const PDFDocument =
      require("pdfkit");

    const pdfDoc =
      new PDFDocument();

    const stream =
      fs.createWriteStream(
        filePath
      );

    pdfDoc.pipe(stream);

    pdfDoc
      .fontSize(18)
      .text(
        "Expense Report"
      );

    pdfDoc.moveDown();

    expenses.forEach(
      (expense) => {

        pdfDoc.text(
          `${expense.title} | ₹${expense.amount} | ${expense.category}`
        );

      }
    );

    pdfDoc.end();

    stream.on(
      "finish",
      () => {

        const pdfUrl =
  `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

        res.status(200).json({
          success: true,
          pdfUrl,
        });

      }
    );

  } catch (error) {
    next(error);
  }
};

const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");

const sendExpenseReport = async (
  req,
  res,
  next
) => {
  try {

    const { email } = req.body;
    
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address",
      });
    }

    const expenses =
      await Expense.find({
        mobNo: req.user.mobNo,
      });

    if (!expenses.length) {
      return res.status(404).json({
        success: false,
        message: "No expenses found",
      });
    }

    const workbook =
      new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Expenses"
      );

    worksheet.columns = [
      {
        header: "Title",
        key: "title",
        width: 25,
      },
      {
        header: "Amount",
        key: "amount",
        width: 15,
      },
      {
        header: "Category",
        key: "category",
        width: 20,
      },
      {
        header: "Description",
        key: "description",
        width: 30,
      },
      {
        header: "Created At",
        key: "createdAt",
        width: 25,
      },
    ];

    expenses.forEach((expense) => {
      worksheet.addRow({
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        description:
          expense.description,
        createdAt:
          expense.createdAt,
      });
    });

    const filePath = path.join(
      __dirname,
      "../../expenses.xlsx"
    );

    await workbook.xlsx.writeFile(
      filePath
    );

    const transporter =

  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true only for 465

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    tls: {
      rejectUnauthorized: false,
    },
  });
  await transporter.verify();

console.log(
  "SMTP Connection Successful"
);

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: email,

      subject: "Expense Report",

      html: `
        <p>
          Please find the attached
          expense report.
        </p>
      `,

      attachments: [
        {
          filename:
            "expenses.xlsx",

          path: filePath,
        },
      ],
    });

    if (
      fs.existsSync(filePath)
    ) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      success: true,
      message:
        "Expense report emailed successfully",
    });

  } catch (error) {
    next(error);
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
  exportExpensesCSV,
  exportExpensesExcel,
  exportExpensesPDF,
  sendExpenseReport,
};