import mongoose from "mongoose";
import { dbConnection } from "./dbConnection.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({ strict: false });
addFormats(ajv);
const applicationsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobSeekers",
    required: [true, "userId is required"],
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobs",
    required: [true, "job is required"],
  },
  status: {
    type: String,
    required: [true, "status is required"],

    enum: ["pending", "approved", "rejected"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: [true, "createdAt is required"],
  },
});
const applicationsAjvSchema = {
  type: "object",
  properties: {
    userId: {
      type: "string",
      //   format: "mongo-id",
      pattern: "^[0-9a-fA-F]{24}$",
    },
    jobId: {
      type: "string",
      pattern: "^[0-9a-fA-F]{24}$",
    },
    status: { type: "string", enum: ["pending", "approved", "rejected"] },
    createdAt: { type: "string", format: "date-time" },
  },

  additionalProperties: false,

  required: ["userId", "jobId", "status"],
};
export const applicationsAjvSchemaValidator = ajv.compile(
  applicationsAjvSchema
);
const applicationsModel = mongoose.model("applications", applicationsSchema);
export default applicationsModel;
