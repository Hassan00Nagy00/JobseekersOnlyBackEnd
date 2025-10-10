import { catchErrors } from "../utils/catchErrorsWrapper.js";

export let bodyCheck = catchErrors(async (req, res, next) => {
  if (req.body) {
    console.log("addApplication have body really!!");
    next();
  } else {
    const customError = new Error("No data recieved");
    customError.statusCode = 400;
    next(customError);
  }
});
