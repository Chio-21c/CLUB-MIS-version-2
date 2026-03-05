import express from "express";
import {
  createPatron,
  getPatrons,
  getPatronById,
  updatePatron,
  deletePatron
} from "../controller/patroncontroller.js";

const router = express.Router();

// Create a new patron
router.post("/", createPatron);

// Get all patrons
router.get("/", getPatrons);

// Get single patron by ID
router.get("/:id", getPatronById);

// Update patron
router.put("/:id", updatePatron);

// Delete patron
router.delete("/:id", deletePatron);

export default router; 