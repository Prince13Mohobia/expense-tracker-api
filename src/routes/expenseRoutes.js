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