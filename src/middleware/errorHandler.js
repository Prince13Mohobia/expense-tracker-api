const errorHandler = (
  err,
  req,
  res,
  next
) => {

  console.error(err);

  if (err.name === "ValidationError") {

    const errors = Object.values(
      err.errors
    ).map((item) => item.message);

    return res.status(400).json({
      success: false,
      message: errors.join(", "),
    });
  }

  return res.status(
    err.statusCode || 500
  ).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error",
  });
};

module.exports = errorHandler;