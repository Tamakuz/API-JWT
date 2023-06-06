import responseHandler from "../utils/response.utils.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import configs from "../configs/index.js";

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const checkUser = await User.findOne({ username });

    if (checkUser)
      return responseHandler.badRequest(res, "Username sudah terpakai");

    const newUser = User();

    newUser.username = username;
    newUser.setPassword(password); //setPassword() didapat di modelnya

    await newUser.save();
    responseHandler.ok(res, newUser);
  } catch (error) {
    console.log(error); //debugging
    responseHandler.error(res);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const checkUser = await User.findOne({ username });

    if (!checkUser)
      return responseHandler.badRequest(res, "Masukan Username Yang Terdaftar");

    if (!checkUser.validPassword(password))
      return responseHandler.badRequest(res, "Wrong Password");

    const token = jwt.sign({ userId: checkUser._id }, configs.jwtSecret, {
      expiresIn: "30s",
    });

    checkUser.password = undefined;
    checkUser.salt = undefined;

    res.cookie("token", token, {
      httpOnly: true,
      domain: "https://fe-jwt.vercel.app/",
      sameSite: "none"
    });

    responseHandler.ok(res, { token, ...checkUser._doc });
  } catch (error) {
    console.log(error);
    responseHandler.error(res);
  }
};

const autenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, configs.jwtSecret);
    res.end();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Token telah kadaluarsa, kirim respons logout otomatis
      res.clearCookie("token", { httpOnly: true });
      return res
        .status(401)
        .json({ message: "Token expired, automatic logout" });
    }
    // Token tidak valid, kirim respons Invalid token
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default { register, login, autenticateToken };
