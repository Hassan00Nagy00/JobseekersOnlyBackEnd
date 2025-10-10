import { catchErrors } from "../utils/catchErrorsWrapper.js";
import { unpackToken } from "../utils/unpackToken.js";

export const checkRole = (unpackedToken) => {
  console.log("entered the checkRole middleware...");
  console.log("unpackToken is : ", unpackedToken);
  if (unpackedToken.role) {
    let role = unpackedToken.role;
    console.log("there are cookies");
    // const role = req.cookies.role;
    if (role == "user") {
      console.log("userRole is user");
      return "user";
    }
    if (role == "admin") {
      console.log("userRole is admin");
      return "admin";
    }
  } else {
    console.log(
      "entered role else cuz of we used userRole innsted of role inside cookies"
    );
    if (unpackedToken.userRole) {
      console.log("userRole is true");
      let role = unpackedToken.userRole;
      console.log("role is :", role);

      if (role == "user") {
        console.log("userRole is user");
        return "user";
      }
      if (role == "admin") {
        console.log("userRole is admin");
        return "admin";
      }
    } else {
      console.log("There is no role.");
      return "undefineeed";
    }
  }
};
export let userOrAdminCheck = catchErrors(async (req, res, next) => {
  let showRole = checkRole(await unpackToken(req.headers.token));
  console.log("showRole : ", showRole);
  if (showRole == "user" || showRole == "admin") {
    console.log("User?!...imporssive");
    console.log("We have data recieved also...");
    next();
  } else {
    const customError = new Error("Only registered users allowed.");
    customError.statusCode = 401;
    next(customError);
  }
});
export let userCheck = catchErrors(async (req, res, next) => {
  let showRole = checkRole(await unpackToken(req.headers.token));
  console.log("showRole : ", showRole);
  if (showRole == "user") {
    console.log("User?!...imporssive");
    console.log("We have data recieved also...");
    next();
  } else {
    const customError = new Error("Only registered users allowed.");
    customError.statusCode = 401;
    next(customError);
  }
});
export let adminCheck = catchErrors(async (req, res, next) => {
  let showRole = checkRole(await unpackToken(req.headers.token));
  console.log("showRole : ", showRole);
  if (showRole == "admin") {
    console.log("User is really an admin!!");

    console.log("We have data recieved also...");
    next();
  } else {
    const customError = new Error("User unauthorized");
    customError.statusCode = 403;
    next(customError);
  }
});
