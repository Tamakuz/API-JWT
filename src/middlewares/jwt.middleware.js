import jwt from "jsonwebtoken";
import config from "../configs/index.js";
import responseHandle from "../utils/response.utils.js";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: "30s",
  });
};

const verifyToken = (token) => {
  const decodedToken = jwt.verify(token, config.jwtSecret);

  return decodedToken;
};

const auth = (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    const token = bearerHeader.split(" ")[1];

    const decodedToken = verifyToken(token);

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    responseHandle.unauthorize(res);
  }
};

export default {
  auth,
};
