import jwt from "jsonwebtoken";

export const generateJWTAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true, //cookie only accessed by client side js
    secure: process.env.NODE_ENV === "production", //for https access only in prod
    samesite: "strict", //csrf attack prev.
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  return token;
};
