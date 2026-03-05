// src/routes/authRoutes.js
import { Router } from "express";
import { signup, login } from "../controller/authcontroller.js";

const router = Router();

// Public signup
router.post("/signup", signup);

// Login
router.post("/login", login);

export default router;
