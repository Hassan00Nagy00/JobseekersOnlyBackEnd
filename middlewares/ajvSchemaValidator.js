import { applicationsAjvSchemaValidator } from "../models/applications.model.js";
import { userAjvSchemaValidation } from "../models/users.model.js";
export let applicationSchemaValidatorFun = (req, res, next) => {
  if (applicationsAjvSchemaValidator(req.body)) {
    console.log("red.data validated Successfully by ajv ");

    next();
  } else {
    console.log("schema failed in ajv");
    const customError = new Error("schema failed in ajv");
    customError.statusCode = 400;
    customError.detailes = applicationsAjvSchemaValidator.errors;

    next(customError);
  }
};

export let userAjvSchemaValidator = (req, res, next) => {
  if (userAjvSchemaValidation(req.body)) {
    console.log("red.data validated Successfully by ajv ");

    next();
  } else {
    console.log("schema failed in ajv");
    const customError = new Error("schema failed in ajv");
    customError.statusCode = 400;
    customError.details = userAjvSchemaValidation.errors;
    next(customError);
  }
};
