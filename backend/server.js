// server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

// Import Sequelize DB connection
import { sequelize } from "./src/config/database.js";

//relationship import
import "./src/models/index.js";

// Import routes
import authRoutes from "./src/routes/authRoutes.js";
import clubRoutes from "./src/routes/clubRoutes.js";
import patronRoutes from "./src/routes/patronRoutes.js";
import membershipRoutes from "./src/routes/membershipRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

// Middleware
import { requireAuth } from "./src/middleware/auth.js";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clubs",clubRoutes);
app.use("/api/patrons", patronRoutes);
app.use("/api/memberships",membershipRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/reports", reportRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("School club members Management System API is running!");
});

const PORT = process.env.PORT || 4000;

// Connect to PostgreSQL and sync models
sequelize
  .sync({ alter: true }) 
  .then(() => {
    console.log("PostgreSQL connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err.message);
    process.exit(1);
  });