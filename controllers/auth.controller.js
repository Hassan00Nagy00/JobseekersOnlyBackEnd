import userModel, { userAjvSchemaValidation } from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookiesParser from "cookie-parser";
import { catchErrors } from "../utils/catchErrorsWrapper.js";
import { checkRole } from "../middlewares/checkRole.js";
import { unpackToken } from "../utils/unpackToken.js";

export let postUserContoller = catchErrors(async (req, res, next) => {
  console.log("/api/auth/register , POST method");
  console.log(req.body);
  let checkEmailAvilability = await userModel.findOne({
    email: req.body.email,
  });
  if (checkEmailAvilability) {
    const customError = new Error("Email already exist");
    customError.statusCode = 409;
    next(customError);
  } else {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    console.log(req.body.password);
    let token = jwt.sign(
      { email: req.body.email, role: req.body.role },
      process.env.SIGNATURE
    );
    console.log("Tokenn : ", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    res.cookie("userRole", "user", {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    let postUser = await userModel.create(req.body);
    res.json(postUser);
  }
});
export let login = catchErrors(async (req, res, next) => {
  console.log("entered login funcion");
  console.log("req.body.email : ", req.body.email);

  let checkEmailAvilability = await userModel.findOne({
    email: req.body.email,
  });
  if (checkEmailAvilability) {
    console.log("email exist : ", checkEmailAvilability);
    let comparePasswords = await bcrypt.compare(
      req.body.password,
      checkEmailAvilability.password
    );
    if (comparePasswords) {
      console.log("passwords are identical");
      console.log("these data about to be bycrypted : ", {
        email: checkEmailAvilability.email,
        userRole: checkEmailAvilability.role,
      });

      let token = await jwt.sign(
        {
          email: checkEmailAvilability.email,
          userRole: checkEmailAvilability.role,
        },
        process.env.SIGNATURE
      );
      console.log("Token is done : ", token);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
      res.send("login success");
    }
  } else {
    console.log("Email doesnt exist");
    const customError = new Error("Email already exist");
    customError.statusCode = 409;
    next(customError);
  }
});
