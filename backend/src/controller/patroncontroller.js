import { Patron, Club } from "../models/index.js";

// Create a new patron and assign to a club
export const createPatron = async (req, res) => {
  try {
    const { name, email, clubId } = req.body;

    // checking if club exist
    if (clubId) {
      const existingClub = await Club.findByPk(clubId);
      if (!existingClub) {
        return res.status(404).json({ message: "Club not found" });
      }
    }

    const patron = await Patron.create({ name, email, clubId });

    // Fetch patron with club info
    const populatedPatron = await Patron.findByPk(patron.id, {
      include: { model: Club, attributes: ["id", "name", "description"] },
    });

    res.status(201).json(populatedPatron);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all patrons with their club info
export const getPatrons = async (req, res) => {
  try {
    const patrons = await Patron.findAll({
      include: { model: Club, attributes: ["id", "name", "description"] },
    });
    res.json(patrons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single patron by ID
export const getPatronById = async (req, res) => {
  try {
    const patron = await Patron.findByPk(req.params.id, {
      include: { model: Club, attributes: ["id", "name", "description"] },
    });
    if (!patron) return res.status(404).json({ message: "Patron not found" });
    res.json(patron);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update patron details or reassign club
export const updatePatron = async (req, res) => {
  try {
    const { name, email, clubId } = req.body;

    // Check club exists if reassigning
    if (clubId) {
      const existingClub = await Club.findByPk(clubId);
      if (!existingClub) {
        return res.status(404).json({ message: "Club not found" });
      }
    }

    const patron = await Patron.findByPk(req.params.id);
    if (!patron) return res.status(404).json({ message: "Patron not found" });

    await patron.update({ name, email, clubId });

    // Fetch updated patron with club info
    const updatedPatron = await Patron.findByPk(req.params.id, {
      include: { model: Club, attributes: ["id", "name", "description"] },
    });

    res.json(updatedPatron);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete patron
export const deletePatron = async (req, res) => {
  try {
    const patron = await Patron.findByPk(req.params.id);
    if (!patron) return res.status(404).json({ message: "Patron not found" });

    await patron.destroy();
    res.json({ message: "Patron deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};