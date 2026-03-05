import { Membership, Club, Patron } from "../models/index.js";

// Student registers for a club (no login required)
export const registerStudent = async (req, res) => {
  try {
    const { clubId, admissionNo, name, className, gender } = req.body;

    // Prevent duplicate admission numbers
    const exists = await Membership.findOne({
      where: { admissionNo, clubId },
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Student already registered for this club" });
    }

    const membership = await Membership.create({
      clubId,
      admissionNo,
      name,
      className,
      gender,
      status: "pending",
    });

    res.status(201).json({ message: "Registration submitted", membership });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve membership
export const approveMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await Membership.findByPk(id);
    if (!membership) return res.status(404).json({ message: "Membership not found" });

    await membership.update({ status: "approved" });
    res.json(membership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject membership
export const rejectMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const membership = await Membership.findByPk(id);
    if (!membership) return res.status(404).json({ message: "Membership not found" });

    await membership.update({ status: "rejected" });
    res.json(membership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List approved members of a club
export const listMembers = async (req, res) => {
  try {
    const { clubId } = req.params;
    const members = await Membership.findAll({
      where: { clubId, status: "approved" },
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List pending requests
export const listPending = async (req, res) => {
  try {
    const { clubId } = req.params;
    const pending = await Membership.findAll({
      where: { clubId, status: "pending" },
    });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Patron-specific member list (restrictions)
export const listMembersByPatron = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (req.user.role === "patron") {
      const club = await Club.findByPk(clubId);
      if (!club || club.patronId !== req.user.id) {
        return res.status(403).json({ message: "Not your club" });
      }
    }

    const members = await Membership.findAll({
      where: { clubId, status: "approved" },
    });

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all pending memberships globally (Admin only)
export const listGlobalPending = async (req, res) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) where.status = status;

    const memberships = await Membership.findAll({
      where,
      include: {
        model: Club,
        attributes: ["id", "name"],
      },
    });

    res.json({ success: true, memberships });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// Delete membership
export const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await Membership.findByPk(id);
    if (!membership) {
      return res.status(404).json({ message: "Membership not found" });
    }

    await membership.destroy();
    res.json({ message: "Membership deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update members
export const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Membership.update(req.body, { where: { id } });
    if (updated) {
      const member = await Membership.findByPk(id, {
        include: { model: Club, attributes: ["id", "name"] }
      });
      res.json(member);
    } else {
      res.status(404).json({ message: "Member not found" });
    }
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};
