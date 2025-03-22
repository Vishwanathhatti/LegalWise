import express from "express";
import { login, logout, registerUser } from "../controllers/user.controller.js";
import multer from "multer";

const userRouter = express.Router()

const upload = multer()
userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(login)
userRouter.route('/logout').get(logout)

export default userRouter;