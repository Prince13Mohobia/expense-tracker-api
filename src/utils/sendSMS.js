const axios =
  require("axios");

const sendSMS = async (
  mobile,
  otp
) => {
  try {

    await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        mobile:
          `91${mobile}`,
        otp,
      },
      {
        headers: {
          authkey:
            process.env
              .MSG91_API_KEY,
          "Content-Type":
            "application/json",
        },
      }
    );

  } catch (error) {

    console.error(
      error.response?.data ||
      error.message
    );

    throw new Error(
      "Failed to send OTP"
    );
  }
};

module.exports =
  sendSMS;