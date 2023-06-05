import express from "express";
import { body } from "express-validator";
import validate from "../utils/request.utils.js";
import userController from "../controllers/user.controller.js";

const router = express.Router();

router.post(
  "/register",
  body("username")
    .exists()
    .withMessage("Username is required")
    .isLength({ min: 8 })
    .withMessage("User minimum 8 characters"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 characters"),
  body("confirmPassword")
    .exists()
    .withMessage("Confirm password is required")
    .isLength({ min: 8 })
    .withMessage("Confirm password minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Confirm password not match");
      return true;
    }),
  validate,
  userController.register
);

router.post(
  "/login",
  body("username")
    .exists()
    .withMessage("Username is required")
    .isLength({ min: 8 })
    .withMessage("User minimum 8 characters"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("password minimum 8 characters"),
  validate,
  userController.login
);

router.get("/authtoken", userController.autenticateToken)

export default router
