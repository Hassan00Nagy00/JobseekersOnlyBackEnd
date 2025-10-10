export const globalErrorHandler = (err, req, res, next) => {
  if (typeof err === "string") {
    return res.status(400).json({
      status: "error",
      message: err,
    });
  }
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Something went wrong",
    details: err.details || "no details provided",
  });
};
