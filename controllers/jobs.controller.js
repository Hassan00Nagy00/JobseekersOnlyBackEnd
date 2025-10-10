import { checkRole } from "../middlewares/checkRole.js";
import jobModel from "../models/jobs.model.js";
import jobsModel, { jobsAjvSchemaValidator } from "../models/jobs.model.js";
import userModel from "../models/users.model.js";
import { catchErrors } from "../utils/catchErrorsWrapper.js";
import { unpackToken } from "../utils/unpackToken.js";
import cookieParser from "cookie-parser";
export let postJobs = catchErrors(async (req, res, next) => {
  if (jobsAjvSchemaValidator(req.body)) {
    console.log("red.data validated Successfully by ajv inside postJobs");
    let token = req.headers.token;
    let findJobExistance = await jobsModel.findOne({
      title: req.body.title,
    });
    if (findJobExistance) {
      console.log("Jop already exist.");
      const customError = new Error("Jop already exist.");
      customError.statusCode = 400;
      next(customError);
    } else {
      res.cookie("token", token, {
        httpOnly: true,
        sameStrict: true,
        maxAge: 60 * 60 * 24,
        secure: false,
      });
      let addJobs = await jobsModel.create(req.body);
      console.log("job added : ", addJobs);
      res.json(addJobs);
    }
  } else {
    console.log("schema failed in ajv");
    const customError = new Error("schema failed in ajv");
    customError.statusCode = 400;
    customError.details = jobsAjvSchemaValidator.errors;
    next(customError);
  }
});
export let getAllJobsController = catchErrors(async (req, res, next) => {
  let getAllUsers = await jobsModel.find();
  console.log("getAllUsers", getAllUsers);
  res.json(getAllUsers);
});
export let getAllJobsControllerDetailedInfo = catchErrors(
  async (req, res, next) => {
    let getAllUsers = await jobsModel
      .aggregate([{ $group: { _id: "$title", jobs: { $push: "$$ROOT" } } }])

      .sort({ title: 1 });
    console.log("getAllUsers", getAllUsers);
    res.json(getAllUsers);
  }
);
export let getAllJobsControllerDetailedInfoWithStats = catchErrors(
  async (req, res, next) => {
    let getAllUsers = await jobsModel
      .aggregate([
        {
          $match: {
            title: "Regional Configuration Designer",
          },
        },
        { $group: { _id: "$title", jobs: { $push: "$$ROOT" } } },
        { $sort: { _id: 1 } },
      ])
      .explain("executionStats");
    console.log("getAllUsers stats", getAllUsers);
    res.json(getAllUsers);
  }
);
export let getJob = catchErrors(async (req, res, next) => {
  let getUser = await jobsModel.findOne({ title: req.params.id });

  console.log("getUsers", getUser);
  res.json(getUser);
});
export let updateJob = catchErrors(async (req, res, next) => {
  let findJobDetails = await jobsModel.findOne({ title: req.params.id });
  console.log("findJobDetails iss : ", findJobDetails);

  if (await findJobDetails) {
    let unpackedTokenFun = await unpackToken(req.headers.token);
    console.log("unpackedTokenFun is ", unpackedTokenFun);
    let showRole = checkRole(await unpackedTokenFun);
    console.log("showRole isss : ", showRole);

    let findUser = await userModel.findOne({
      email: unpackedTokenFun.email,
    });
    console.log("findUser._id is ", findUser._id);

    console.log(
      "job's createdBy value is : ",
      await findJobDetails.createdBy.toString()
    );
    if (findJobDetails.createdBy.toString() == findUser._id.toString()) {
      console.log("this user is really the owner of this job!!!");
      let findAndUpdate = await jobModel.findByIdAndUpdate(
        findJobDetails._id,
        req.body
      );

      res.json(findAndUpdate);
    } else {
      console.log("You are not the job owner");
      const customError = new Error("You are not the job owner");
      customError.statusCode = 401;
      next(customError);
    }
  } else {
    console.log("Job not found");
    const customError = new Error("Job not found");
    customError.statusCode = 404;
    next(customError);
  }
});
export let deleteJobs = catchErrors(async (req, res, next) => {
  console.log("User is admin already!!!");
  let findAndDeleteUser = await userModel.findOneAndDelete({
    title: req.params.id,
  });
  console.log("findAndDeleteUser", findAndDeleteUser);
  res.json(findAndDeleteUser);
});
