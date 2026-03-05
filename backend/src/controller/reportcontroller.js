import Membership from "../models/membership.js";
import Club from "../models/club.js";
import { fn, col } from "sequelize";

// Members per Club with club name, id, and total members
export const membersPerClub = async (req, res) => {
  try {
    const agg = await Membership.findAll({
      attributes: [
        "clubId",
        [fn("COUNT", col("id")), "totalMembers"],
      ],
      where: { status: "approved" },
      group: ["clubId"],
      raw: true,
    });

    const clubIds = agg.map((a) => a.clubId);
    const clubs = await Club.findAll({
      where: { id: clubIds },
      attributes: ["id", "name"],
      raw: true,
    });

    const clubMap = new Map(clubs.map((c) => [c.id, c.name]));

    const result = agg.map((a) => ({
      clubId: a.clubId,
      clubName: clubMap.get(a.clubId) || "Unknown Club",
      totalMembers: parseInt(a.totalMembers),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// All Members with Clubs
export const allMembersWithClubs = async (req, res) => {
  try {
    const members = await Membership.findAll({
      where: { status: "approved" },
      include: {
        model: Club,
        attributes: ["id", "name", "description"],
      },
      attributes: [
        "id",
        "admissionNo",
        "name",
        "className",
        "gender",
        "status",
        "clubId",
      ],
    });

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};