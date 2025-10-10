import jwt from "jsonwebtoken";
export const unpackToken = (token) => {
  console.log("entered decodedToken function");
  let decodedToken = jwt.verify(token, process.env.SIGNATURE);
  console.log("decodedToken : ", decodedToken);
  return decodedToken;
};
