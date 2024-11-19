import { Router } from "express";
import {loginHandler, logoutHandler, refreshHandler, registerHandler} from "../controller/user.controller";



const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);

// login
authRoutes.post("/login", loginHandler);

// logut
authRoutes.get("/logout", logoutHandler);

// refresh request
authRoutes.get("/refresh", refreshHandler);

export default authRoutes;