import express from "express";
import {
  deleteUser,
  getAllUsersController,
  getAllUsersControllerWithStats,
  getMe,
} from "../controllers/users.controller.js";
import { adminCheck, userOrAdminCheck } from "../middlewares/checkRole.js";
import { tokenExitance } from "../middlewares/tokenExistance.js";

const usersRouter = express.Router();
usersRouter.get("/", tokenExitance, adminCheck, getAllUsersController);

usersRouter.get(
  "/stats",
  tokenExitance,
  adminCheck,
  getAllUsersControllerWithStats
);

usersRouter.delete("/:id", tokenExitance, adminCheck, deleteUser);
usersRouter.get("/me", tokenExitance, userOrAdminCheck, getMe);
export default usersRouter;
