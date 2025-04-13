import express from "express";
import { login, logout, registerUser } from "../controllers/user.controller.js";
import multer from "multer";
import { verifyToken } from "../middlewares/verifyToken.js";

const userRouter = express.Router()

const upload = multer()
userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(login)
userRouter.route('/logout').get(verifyToken,logout)

export default userRouter;