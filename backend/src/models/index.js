//relationship between clubs patrons and members
import Club from "./club.js";
import Patron from "./patron.js";
import Membership from "./membership.js";

// 1 Club → Many Patrons
Club.hasMany(Patron, { foreignKey: "clubId" });
Patron.belongsTo(Club, { foreignKey: "clubId" });

// 1 Club → Many Memberships
Club.hasMany(Membership, { foreignKey: "clubId" });
Membership.belongsTo(Club, { foreignKey: "clubId" });

export { Club, Patron, Membership };