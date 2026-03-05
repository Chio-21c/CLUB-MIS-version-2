import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Patron = sequelize.define("Patron", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  clubId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "patrons",
  timestamps: true,
});

export default Patron;
