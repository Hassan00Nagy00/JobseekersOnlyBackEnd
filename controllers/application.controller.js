import { checkRole } from "../middlewares/checkRole.js";
import applicationsModel, {
  applicationsAjvSchemaValidator,
} from "../models/applications.model.js";

import { catchErrors } from "../utils/catchErrorsWrapper.js";
import { unpackToken } from "../utils/unpackToken.js";

export let addApplication = catchErrors(async (req, res, next) => {
  console.log("req.body.userId : ", req.body.userId);

  let findApplicationExistance = await applicationsModel.findOne({
    userId: req.body.userId,
  });
  if (findApplicationExistance) {
    console.log("application alerady exist");
    res.status(500).send("application alerady exist");
  } else {
    res.cookie("token", token, {
      httpOnly: true,
      sameStrict: true,
      maxAge: 60 * 60 * 24,
      secure: false,
    });
    let addApplication = await applicationsModel.create(req.body);
    console.log("job added : ", addApplication);
    res.json(addApplication);
  }
});
export let getAllApplicationsController = catchErrors(
  async (req, res, next) => {
    console.log("entered the getAllApplicationsController function");
    let getAllApplications = await applicationsModel.find();

    console.log("getAllApplications", getAllApplications);
    res.json(getAllApplications);
  }
);
export let getAllApplicationsControllerDetailedInfo = catchErrors(
  async (req, res, next) => {
    console.log("entered the getAllApplicationsController function");
    let getAllApplications = await applicationsModel.aggregate([
      {
        $lookup: {
          localField: "userId",
          foreignField: "_id",
          from: "jobsseekers",
          as: "userInfo",
        },
      },
      {
        $lookup: {
          localField: "jobId",
          foreignField: "_id",
          from: "jobs",
          as: "jobInfo",
        },
      },
      { $unwind: { path: "$userInfo" } },
      { $unwind: { path: "$jobInfo" } },
      { $group: { _id: "$_id", applications: { $push: "$$ROOT" } } },
      { $unwind: "$applications" },
    ]);
    // .sort({ _id: 1 });
    console.log(
      "getAllApplications",
      getAllApplications.explain("executionStats")
    );
    res.json(getAllApplications);
  }
);

export let getMyApplications = catchErrors(async (req, res, next) => {
  console.log("entered the getMyApplication function");

  let user = await unpackToken(req.headers.token);

  console.log("User is !! : ", user);

  console.log("We have data recieved also...");

  let getMyApp = await applicationsModel.find({
    userId: user._id,
  });
  console.log("getMyApp", getMyApp);
  res.json(getMyApp);
});
