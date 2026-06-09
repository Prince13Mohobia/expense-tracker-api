const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP");

// Send OTP
const sendOTP = async (req, res) => {
  try {
    const { mobNo } = req.body;

    if (!mobNo) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    const otp = generateOTP();

    let user = await User.findOne({ mobNo });

    if (user) {
      user.otp = otp;
      user.otpExpiresAt = new Date(
        Date.now() + 5 * 60 * 1000
      );
      await user.save();
    } else {
      user = await User.create({
        mobNo,
        otp,
        otpExpiresAt: new Date(
          Date.now() + 5 * 60 * 1000
        ),
      });
    }

    res.status(200).json({
      success: true,
      otp, // remove later when WhatsApp is integrated
      message: "OTP sent successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { mobNo, otp, name } = req.body;

    const user = await User.findOne({ mobNo });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (!user.name && name) {
      user.name = name;
    }

    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        mobNo: user.mobNo,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );

    res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};