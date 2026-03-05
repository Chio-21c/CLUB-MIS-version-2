import Membership from "../models/membership.js";
import Club from "../models/club.js";
import Patron from "../models/patron.js";
import { sequelize } from "../config/database.js";
import { fn, col } from "sequelize";

export const dashboard = async (req, res) => {
  try {
    // Total approved members
    const totalMembers = await Membership.count({
      where: { status: "approved" },
    });

    // Total clubs
    const totalClubs = await Club.count();

    // Total patrons
    const totalPatrons = await Patron.count();

    // Members per club with club names
    const membersPerClubRaw = await Membership.findAll({
      attributes: [
        "clubId",
        [fn("COUNT", col("id")), "totalMembers"],
      ],
      where: { status: "approved" },
      group: ["clubId"],
      raw: true,
    });

    // Fetch club names
    const clubIds = membersPerClubRaw.map((m) => m.clubId);
    const clubs = await Club.findAll({
      where: { id: clubIds },
      attributes: ["id", "name"],
      raw: true,
    });

    const clubMap = new Map(clubs.map((c) => [c.id, c.name]));

    const membersPerClub = membersPerClubRaw.map((m) => ({
      clubId: m.clubId,
      clubName: clubMap.get(m.clubId) || "Unknown Club",
      totalMembers: parseInt(m.totalMembers),
    }));

    res.json({
      totalMembers,
      totalClubs,
      totalPatrons,
      membersPerClub,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
