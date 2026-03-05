import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Club = sequelize.define("Club", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "clubs",
  timestamps: true, // adds createdAt and updatedAt
});

export default Club;