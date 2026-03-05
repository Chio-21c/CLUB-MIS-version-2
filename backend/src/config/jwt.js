import jwt from "jsonwebtoken";

//singing tokens and payloads
export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20min" });
};

// Verify and decode the token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};