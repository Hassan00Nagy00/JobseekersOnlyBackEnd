import express from "express";
import {
  deleteJobs,
  getAllJobsController,
  getAllJobsControllerDetailedInfo,
  getAllJobsControllerDetailedInfoWithStats,
  getJob,
  postJobs,
  updateJob,
} from "../controllers/jobs.controller.js";
import { bodyCheck } from "../middlewares/checkBody.js";
import { tokenExitance } from "../middlewares/tokenExistance.js";
import { adminCheck, userOrAdminCheck } from "../middlewares/checkRole.js";

const jobsRouter = express.Router();
jobsRouter.post("/", bodyCheck, tokenExitance, postJobs);
jobsRouter.get("/", tokenExitance, userOrAdminCheck, getAllJobsController);
jobsRouter.get(
  "/detailedInfo",
  tokenExitance,
  userOrAdminCheck,
  getAllJobsControllerDetailedInfo
);
jobsRouter.get(
  "/detailedInfoStats",
  tokenExitance,
  userOrAdminCheck,
  getAllJobsControllerDetailedInfoWithStats
);
jobsRouter.get("/:id", getJob);
jobsRouter.patch("/:id", tokenExitance, userOrAdminCheck, updateJob);
jobsRouter.delete("/:id", tokenExitance, adminCheck, deleteJobs);
export default jobsRouter;
