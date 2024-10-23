import { Router } from "express";
import { loginHandler, registerHandler } from "../controller/user.controller";



const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);

// login
authRoutes.post("/login", loginHandler);

export default authRoutes;