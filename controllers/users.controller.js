import { checkRole } from "../middlewares/checkRole.js";
import userModel from "../models/users.model.js";
import { catchErrors } from "../utils/catchErrorsWrapper.js";
import { unpackToken } from "../utils/unpackToken.js";

// userAjvSchema(req.body);
export let getAllUsersController = catchErrors(async (req, res, next) => {
  let getAllUsers = await userModel
    .aggregate([{ $group: { _id: "$name", users: { $push: "$$ROOT" } } }])
    .sort({ name: 1 });
  console.log("getAllUsers", getAllUsers);
  res.json(getAllUsers);
});
export let getAllUsersControllerWithStats = catchErrors(
  async (req, res, next) => {
    console.log("entered the getAllUsersControllerWithStats ");

    let getAllUsers = await userModel
      .aggregate([
        { $match: { email: "Wyman3@hotmail.com" } },
        {
          $lookup: {
            foreignField: "_id",
            localField: "userId",
            from: "jobSeekers",
            as: "userInfo",
          },
        },
        { $group: { _id: "$name", users: { $push: "$$ROOT" } } },
      ])
      .sort({ name: 1 })
      .explain("executionStats");
    console.log("getAllUsers", getAllUsers);
    res.json(getAllUsers);
  }
);
export let deleteUser = catchErrors(async (req, res, next) => {
  let findAndDeleteUser = await userModel.findByIdAndDelete(req.params.id);
  console.log("getAllUsers", findAndDeleteUser);
  res.json(findAndDeleteUser);
});
export let getMe = catchErrors(async (req, res, next) => {
  console.log("entered the getMe function");

  let user = await unpackToken(req.headers.token);
  console.log("User is : !! ", user);

  let getUser = await userModel.find({
    email: user.email,
  });
  console.log("getUser", getUser);
  res.json(getUser);
});
