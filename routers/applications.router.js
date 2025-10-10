import express from "express";
import {
  addApplication,
  getAllApplicationsController,
  getAllApplicationsControllerDetailedInfo,
  getMyApplications,
} from "../controllers/application.controller.js";
import { adminCheck, userCheck } from "../middlewares/checkRole.js";
import { tokenExitance } from "../middlewares/tokenExistance.js";
import { bodyCheck } from "../middlewares/checkBody.js";
import { applicationSchemaValidatorFun } from "../middlewares/ajvSchemaValidator.js";
const applicationRouter = express.Router();
applicationRouter.post(
  "/",
  bodyCheck,
  tokenExitance,
  userCheck,
  applicationSchemaValidatorFun,
  addApplication
);
applicationRouter.get(
  "/",
  tokenExitance,
  adminCheck,
  getAllApplicationsController
);
applicationRouter.get(
  "/detailedInfo",
  tokenExitance,
  adminCheck,
  getAllApplicationsControllerDetailedInfo
);
applicationRouter.get("/my-Applications", tokenExitance, getMyApplications);
export default applicationRouter;
