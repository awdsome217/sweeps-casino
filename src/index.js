import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import pool from "./db.js";

const app = express();

// middleware (THIS MUST BE BEFORE ROUTES)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

/**
 * HEALTH CHECK
 */
app.get("/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      ok: true,
      time: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

/**
 * REGISTER
 */
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );

    res.status(201).json(userResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error",
    });
  }
});

/**
 * START SERVER
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
