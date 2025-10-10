import express from "express";
import { login, postUserContoller } from "../controllers/auth.controller.js";
import { bodyCheck } from "../middlewares/checkBody.js";
import { tokenExitance } from "../middlewares/tokenExistance.js";
import { userAjvSchemaValidator } from "../middlewares/ajvSchemaValidator.js";
const authRouter = express.Router();
authRouter.post(
  "/register",
  bodyCheck,
  userAjvSchemaValidator,
  postUserContoller
);
authRouter.post("/login", tokenExitance, login);
export default authRouter;
