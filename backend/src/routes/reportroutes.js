import { Router } from "express";
import {
  membersPerClub,
  allMembersWithClubs,
} from "../controller/reportcontroller.js";

const router = Router();

// Members per Club (admin)
router.get(
  "/members-per-club",
  membersPerClub
);

// All Members with Clubs (admin)
router.get(
  "/all-members",
  allMembersWithClubs
);

export default router;