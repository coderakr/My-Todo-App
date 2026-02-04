import { Router } from "express";
import {
  login,
  logout,
  register,
  me,
} from "../controllers/auth.controllers.js";
import { auth } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", auth, me);
authRouter.post("/logout", auth, logout);

export default authRouter;
