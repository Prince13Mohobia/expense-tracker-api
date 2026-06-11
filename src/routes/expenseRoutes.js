const express = require("express");

const { 
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
} = require("../controllers/expenseController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Expenses
 *   description: Expense Management APIs
 */

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create Expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Laptop Repair"
 *               amount:
 *                 type: number
 *                 example: 1500
 *               category:
 *                 type: string
 *                 example: "IT"
 *               description:
 *                 type: string
 *                 example: "SSD replacement"
 *     responses:
 *       201:
 *         description: Expense created successfully
 */
router.post("/", protect, createExpense);

/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses with pagination, search, filtering and sorting
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           example: IT
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: laptop
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - latest
 *             - oldest
 *             - amount_asc
 *             - amount_desc
 *     responses:
 *       200:
 *         description: Expenses fetched successfully
 */

router.get("/", protect, getExpenses);

/**
 * @swagger
 * /api/expenses/summary:
 *   get:
 *     summary: Expense Summary
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expense summary fetched successfully
 */
router.get("/summary", protect, getSummary);

/**
 * @swagger
 * /api/expenses/monthly-summary:
 *   get:
 *     summary: Monthly expense analytics
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly expense summary
 */

/**
 * @swagger
 * /api/expenses/monthly-summary:
 *   get:
 *     summary: Get monthly expense analytics
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly expense summary
 */
router.get( "/monthly-summary", protect, getMonthlySummary );


/**
 * @swagger
 * /api/expenses/category-summary:
 *   get:
 *     summary: Get category wise expense analytics
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category wise summary
 */
router.get( "/category-summary", protect, getCategorySummary );

/**
 * @swagger
 * /api/expenses/date-summary:
 *   get:
 *     summary: Get expense summary between dates
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-06-01
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-06-30
 *     responses:
 *       200:
 *         description: Date range summary
 */
router.get( "/date-summary", protect, getDateRangeSummary );

/**
 * @swagger
 * /api/expenses/top-expenses:
 *   get:
 *     summary: Get top 5 highest expenses
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top expenses fetched successfully
 */
router.get( "/top-expenses", protect, getTopExpenses );

/**
 * @swagger
 * /api/expenses/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get( "/dashboard", protect, getDashboard );

/**
 * @swagger
 * /api/expenses/export/csv:
 *   get:
 *     summary: Export expenses as CSV
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file downloaded successfully
 */
router.get( "/export/csv", protect, exportExpensesCSV );

/**
 * @swagger
 * /api/expenses/export/excel:
 *   get:
 *     summary: Export expenses as Excel
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 */
router.get( "/export/excel", protect, exportExpensesExcel );

/**
 * @swagger
 * /api/expenses/export/pdf:
 *   get:
 *     summary: Export expenses as PDF
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 */
router.get( "/export/pdf", protect, exportExpensesPDF );

/**
 * @swagger
 * /api/expenses/email-report:
 *   post:
 *     summary: Send expense report as Excel attachment via email
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "mohobiaprince31@gmail.com"
 *     responses:
 *       200:
 *         description: Expense report emailed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Expense report emailed successfully
 *       404:
 *         description: No expenses found
 *       400:
 *         description: Invalid email address
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post( "/email-report", protect, sendExpenseReport );

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update Expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Expense updated successfully
 */
router.put("/:id", protect, updateExpense );

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete Expense
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Expense deleted successfully
 */
router.delete("/:id", protect, deleteExpense );

module.exports = router;