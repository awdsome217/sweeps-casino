import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
const { email, password, username } = req.body;
if (!email || !password || !username) {
  return res.status(400).json({ error: "Missing fields" });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash, username) VALUES ($1,$2,$3)",
      [email, hash, username]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const result = await pool.query(
      "SELECT id, email, password_hash, username FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      user: { id: user.id, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});
export default router;
