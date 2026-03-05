import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

// Explicitly load .env from backend folder
dotenv.config({ path: path.resolve("./backend/.env") });

export const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: "postgres",
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected via Sequelize");
  } catch (error) {
    console.error("Sequelize connection failed:", error.message);
    process.exit(1);
  }
};