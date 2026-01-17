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
app.get("/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ ok: true, time: result.rows[0].now });
  } catch (err) {
    console.error("DB health error:", err);
    res.status(500).json({ ok: false, error: "db error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
