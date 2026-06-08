// src/routes/authRoutes.js
import { Router } from "express";
import { signup, login } from "../controller/authcontroller.js";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

export default router;
