const axios = require("axios");

const sendSMS = async (
  mobile,
  otp
) => {
  try {

    const response =
    await axios.post(
        "https://control.msg91.com/api/v5/otp",
        {
        mobile: `91${mobile}`,
        otp: otp,
        template_id:
            process.env.MSG91_TEMPLATE_ID,
        },
        {
        headers: {
            authkey:
            process.env.MSG91_API_KEY,
            "Content-Type":
            "application/json",
        },
        }
    );

    console.log(
      "MSG91 Response:",
      response.data
    );

  } catch (error) {

    console.error(
      "MSG91 Error:",
      error.response?.data ||
      error.message
    );

    throw error;
  }
};

module.exports = sendSMS;