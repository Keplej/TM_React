import { Router } from "express";
import { loginHandler, logoutHandler, registerHandler } from "../controller/user.controller";



const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);

// login
authRoutes.post("/login", loginHandler);

// logut
authRoutes.get("/logout", logoutHandler);

export default authRoutes;