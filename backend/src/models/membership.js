import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Membership = sequelize.define("Membership", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  clubId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  admissionNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  className: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("male", "female"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
}, {
  tableName: "memberships",
  timestamps: true, // Adds createdAt and updatedAt
});

export default Membership;