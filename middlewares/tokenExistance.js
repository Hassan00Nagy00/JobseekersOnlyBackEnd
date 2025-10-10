import { catchErrors } from "../utils/catchErrorsWrapper.js";

export let tokenExitance = catchErrors(async (req, res, next) => {
  if (req.headers.token) {
    console.log("req.headers.token is : ", req.headers.token);
    next();
  } else {
    const customError = new Error("Account is must to continue...");
    customError.statusCode = 401;
    next(customError);
  }
});
