import { Club, Patron } from "../models/index.js";

// Create a new club
export const createClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    const club = await Club.create({ name, description });
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all clubs with patron names
export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.findAll({
      include: {
        model: Patron,
        attributes: ["id", "name", "email"],
      },
    });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single club by ID with patrons
export const getClubById = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id, {
      include: {
        model: Patron,
        attributes: ["id", "name", "email"],
      },
    });
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update club details
export const updateClub = async (req, res) => {
  try {
    const { name, description } = req.body;
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    await club.update({ name, description });

    const updatedClub = await Club.findByPk(req.params.id, {
      include: { model: Patron, attributes: ["id", "name", "email"] },
    });
    res.json(updatedClub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete club
export const deleteClub = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });

    await club.destroy();
    res.json({ message: "Club deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};