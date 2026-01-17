// src/index.js
import "./db/init.js";
import express from "express";
import cors from "cors";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import requireAuth from "./routes/requireAuth.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.get("/protected", requireAuth, (req, res) => {
  res.json({
    ok: true,
    message: "You accessed a protected route",
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
