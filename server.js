import express from "express";
import morgan from "morgan";
import fs from "fs";
import { globalErrorHandler } from "./utils/globalErrorHandler.js";
import usersRouter from "./routers/users.router.js";
import authRouter from "./routers/auth.router.js";
import jobsRouter from "./routers/jobs.router.js";
import applicationRouter from "./routers/applications.router.js";
import dotenv from "dotenv";
dotenv.config();
const expressExec = express();
expressExec.use(express.json());
const createStream = await fs.createWriteStream("./logs.txt", { flags: "a" });

expressExec.use(morgan("dev", { stream: createStream }));

expressExec.use("/api/auth/", authRouter);
expressExec.use("/api/users", usersRouter);
expressExec.use("/api/jobs/", jobsRouter);
expressExec.use("/api/applications/", applicationRouter);
// (async () => {
//   console.log("entered");

//   let users = [];
//   const emails = new Set();
//   const names = new Set();
//   const passwords = new Set();

//   for (let i = 0; i < 500000; i++) {
//     let emaill = faker.internet.email();
//     let namee = faker.person.fullName();
//     let passwordd = await bcrypt.hash("1234567", 10);
//     console.log("passwordd : ", passwordd);

//     if (!emails.has(emaill) && !names.has(namee) && !passwords.has(passwordd)) {
//       console.log("eterm is true");

//       emails.add(emaill);
//       passwords.add(passwordd);
//       names.add(namee);
//       users.push({
//         name: namee,
//         email: emaill,
//         password: passwordd,
//         role: faker.helpers.arrayElement(["user", "admin"]),
//       });
//     }
//   }
//   console.log("this is users : ", users);

//   let insertedUsers = await userModel.insertMany(users);
//   console.log("Inserted users:", insertedUsers.length);

//   let jobs = [];
//   let titles = new Set();
//   let compnies = new Set();
//   let deadLines = new Set();
//   let locations = new Set();
//   let salaries = new Set();

//   for (let i = 0; i < 200000; i++) {
//     let randomUser =
//       insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
//     let titlee = faker.person.jobTitle();
//     let companyy = faker.company.name();
//     let locationn = faker.location.city();
//     let deadLinee = faker.date.future();
//     let salaryy = faker.number.int({ min: 3000, max: 20000 });
//     if (
//       !titles.has(titlee) &&
//       !compnies.has(companyy) &&
//       !locations.has(locationn) &&
//       !deadLines.has(deadLinee) &&
//       !salaries.has(salaryy)
//     ) {
//     }
//     jobs.push({
//       title: titlee,
//       company: companyy,
//       salary: salaryy,
//       location: locationn,
//       type: faker.helpers.arrayElement(["fullTime", "partTime"]),
//       industry: faker.helpers.arrayElement([
//         "IT",
//         "Finance",
//         "healthCare",
//         "entertainment",
//         "constructions",
//         "Manifacturing",
//       ]),
//       deadLine: deadLinee,
//       createdBy: randomUser._id,
//     });
//   }
//   let insertedJobs = await jobsModel.insertMany(jobs);
//   console.log("Inserted jobs:", insertedJobs.length);

//   let applications = [];

//   for (let i = 0; i < 50000; i++) {
//     let randomUser =
//       insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
//     let randomJob =
//       insertedJobs[Math.floor(Math.random() * insertedJobs.length)];

//     applications.push({
//       userId: randomUser._id,
//       jobId: randomJob._id,
//       status: faker.helpers.arrayElement(["pending", "approved", "rejected"]),
//       createdAt: faker.date.recent(),
//     });
//   }
//   let insertedApplications = await applicationsModel.insertMany(applications);
//   console.log("Inserted appliocations:", insertedApplications.length);
// })();

expressExec.all("/", (req, res, next) => {
  next(new Error(`The requested URL is not on the list : ${req.originalUrl}`));
});
expressExec.use(globalErrorHandler);

expressExec.listen(process.env.PORT, (err) => {
  if (err) console.log(err);
  else {
    console.log("Connected to port, hence created a server.... ");
  }
});
