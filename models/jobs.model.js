import mongoose from "mongoose";
import { dbConnection } from "./dbConnection.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({ strict: false });
addFormats(ajv);
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [3, "Title must be at least 3 chars"],
    maxlength: [100, "Title must be at most 50 chars"],
    trim: true,
  },
  company: {
    type: String,
    required: [true, "company is required"],
    minlength: [3, "company must be at least 3 chars"],
    maxlength: [100, "company must be at most 50 chars"],
    trim: true,
  },
  salary: {
    type: Number,
    required: [true, "salary is required"],
    min: [15, "salary must be at least 15 chars"],
  },
  location: { type: String, required: [true, "location is required"] },
  type: {
    type: String,
    enum: ["fullTime", "partTime"],
    required: [true, "type is required"],
  },
  industry: {
    required: [true, "industry is required"],
    type: String,
    enum: [
      "IT",
      "Finance",
      "healthCare",
      "entertainment",
      "constructions",
      "Manifacturing",
    ],
  },
  createdAt: { type: Date, default: Date.now },
  deadLine: { type: Date, required: [true, "deadLine is required"] },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    // required: [true, "createdBy is required"],
  },
});
const jobAjvSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minlength: 3,
      maxLength: 50,
    },
    company: {
      type: "string",
      minlength: 3,
      maxLength: 50,
    },
    salary: {
      type: "number",
      minimum: 15,
    },
    location: { type: "string" },
    type: { type: "string", enum: ["fullTime", "partTime"] },
    industry: {
      type: "string",
      enum: [
        "IT",
        "Finance",
        "healthCare",
        "entertainment",
        "constructions",
        "Manifacturing",
      ],
    },
    createdAt: { type: "string", format: "date-time" },
    deadLine: { type: "string", format: "date-time" },
    createdBy: {
      type: "string",
      validate: (data) => /^[0-9a-fA-F]{24}$/.test(data),
    },
  },
  required: [
    "title",
    "company",
    "salary",
    "location",
    "type",
    "deadLine",
    "industry",
  ],
};
export const jobsAjvSchemaValidator = ajv.compile(jobAjvSchema);
// jobSchema.index({ salary: 1 });
// jobSchema.index({ location: 1 });
// jobSchema.index({ industry: 1 });
// jobSchema.index({ title: 1 });
// dbConnection.jobs.createIndex({ title: 1 });

let jobModel = mongoose.model("jobs", jobSchema);
await jobModel.syncIndexes();
export default jobModel;
