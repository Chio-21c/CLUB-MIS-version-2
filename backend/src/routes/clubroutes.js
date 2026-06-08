import express from "express";
import {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub
} from "../controller/clubcontroller.js";

const router = express.Router();

router.post("/", createClub);
router.get("/", getClubs);
router.get("/:id", getClubById);
router.put("/:id", updateClub);
router.delete("/:id", deleteClub);

export default router;
