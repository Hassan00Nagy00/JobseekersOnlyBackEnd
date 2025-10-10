import mongoose from "mongoose";
import { dbConnection } from "./dbConnection.js";
import Ajv from "ajv";
import validator from "validator";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: [3, "Name must be at least 3 characters"],
    max: [40, "Name cannot exceed 50 characters"],
    match: /[a-zA-Z0-9_].+$/,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    // unique: true,
    validate: [validator.isEmail, "[Enter a valid email]"],

    required: true,
  },
  password: {
    type: String,
    min: [6, "Password must be 6 chars at least"],
  },
  role: {
    type: String,
    enum: ["user", "admin", "guest"],
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});
const userAjvSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 40,
      pattern: "^[a-zA-Z0-9_]+$",
    },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
    role: {
      type: "string",
      enum: ["user", "admin", "guest"],
    },
    createdAt: { type: "string", format: "date-time" },
    isActive: { type: "boolean", default: true },
  },
  required: ["name", "email", "password", "role"],
};
// userSchema.index({ email: 1 });

export const userAjvSchemaValidation = ajv.compile(userAjvSchema);

const userModel = mongoose.model("jobsSeekers", userSchema);
await userModel.syncIndexes();
export default userModel;
