import { Router } from "express";
import {
  registerStudent,
  approveMembership,
  rejectMembership,
  listMembers,
  listPending,
  listGlobalPending,
  deleteMembership,
  updateMembership,
} from "../controller/membershipcontroller.js";

const router = Router();

// Public route: students register without login
router.post("/", registerStudent);
router.put("/:id", updateMembership);

// Patron/Admin routes
router.patch("/:id/approve", approveMembership);
router.patch("/:id/reject", rejectMembership);
router.get("/club/:clubId/members", listMembers);
router.get("/club/:clubId/pending",  listPending);

// Global: list all memberships by status (Admin only)
router.get("/", listGlobalPending);

// Delete membership (Admin/Patron)
router.delete("/:id", deleteMembership);

export default router;