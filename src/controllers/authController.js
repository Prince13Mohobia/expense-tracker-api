const User = require("../models/User");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP");
const sendSMS = require("../utils/sendSMS");

// Send OTP
const sendOTP = async (
  req,
  res,
  next
) => {
  try {

    const { mobNo } =
      req.body;

    const mobileRegex =
      /^[6-9]\d{9}$/;

    if (
      !mobileRegex.test(
        mobNo
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid mobile number",
      });
    }

    const otp =
      generateOTP();

    let user =
      await User.findOne({
        mobNo,
      });

    if (user) {

      user.otp = otp;

      user.otpExpiresAt =
        new Date(
          Date.now() +
          5 * 60 * 1000
        );

      await user.save();

    } else {

      user =
        await User.create({
          mobNo,
          otp,
          otpExpiresAt:
            new Date(
              Date.now() +
              5 * 60 * 1000
            ),
        });
    }

    await sendSMS(
      mobNo,
      otp
    );

    res.status(200).json({
      success: true,
      message:
        "OTP sent successfully",
    });

  } catch (error) {

    next(error);

  }
};

// Verify OTP
const verifyOTP = async (
  req,
  res,
  next
) => {
  try {

    const {
      mobNo,
      otp,
      name,
    } = req.body;

    const user =
      await User.findOne({
        mobNo,
      });

    if (!user) {

      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });

    }

    if (
      user.otp !== otp
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid OTP",
      });

    }

    if (
      new Date() >
      user.otpExpiresAt
    ) {

      return res.status(400).json({
        success: false,
        message:
          "OTP expired",
      });

    }

    if (
      !user.name &&
      name
    ) {
      user.name = name;
    }

    user.otp = null;
    user.otpExpiresAt =
      null;

    await user.save();

    const token =
      jwt.sign(
        {
          id: user._id,
          mobNo:
            user.mobNo,
          role:
            user.role,
        },
        process.env
          .JWT_SECRET,
        {
          expiresIn:
            process.env
              .JWT_EXPIRE,
        }
      );

    res.status(200).json({
      success: true,
      token,

      user: {
        id: user._id,
        name:
          user.name,
        mobNo:
          user.mobNo,
        role:
          user.role,
      },
    });

  } catch (error) {

    next(error);

  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};