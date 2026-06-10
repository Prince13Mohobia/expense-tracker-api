const express = require("express");

const {
  sendOTP,
  verifyOTP,
} = require("../controllers/authController");

const router = express.Router();
/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to mobile number
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobNo:
 *                 type: string
 *                 example: "8983080747"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/send-otp", sendOTP);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobNo:
 *                 type: string
 *                 example: "8983080747"
 *               otp:
 *                 type: string
 *                 example: "1234"
 *               name:
 *                 type: string
 *                 example: "Prince"
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/verify-otp", verifyOTP);

module.exports = router;