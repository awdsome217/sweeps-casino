// src/index.js
import "./db/init.js";
import authRoutes from "./routes/auth.js";
import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ ok: true, time: result.rows[0] });
  } catch (err) {
    console.error("DB health error:", err);
    res.status(500).json({ ok: false, error: "db error" });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email`,
      [email, passwordHash]
    );

    return res.json({ ok: true, user: userResult.rows[0] });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    // common case: duplicate email
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }

      return res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
