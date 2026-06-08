import { Router } from "express";
import { requireAuth} from "../middleware/auth.js";
import User from "../models/user.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { role, status } = req.query;

    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query).select("name email role status");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
export default router;