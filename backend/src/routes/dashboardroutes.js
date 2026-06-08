import { Router } from "express";
import { dashboard } from "../controller/dashboardcontroller.js";

const router = Router();

// Dashboard overview (admins)
router.get(
  "/overview",
  dashboard
);

export default router;