import express from "express";
import pool from "./db.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      ok: true,
      time: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});
;
app.post("/auth/register", async (req, res) => {
  try {
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

    const user = userResult.rows[0];

    // Starting balances (sweeps style)
    await pool.query(
      `INSERT INTO balances (user_id, gc, sc)
       VALUES ($1, $2, $3)`,
      [user.id, 1000000, 100]
    );

    res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        gc: 1000000,
        sc: 100
      }
    });
  } catch (err) {
    console.error(err);

    // duplicate email
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already registered" });
    }

    res.status(500).json({ error: "Registration failed" });
  }
});
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "email and password required" });
    }

    // for now just prove we received it
    return res.json({ ok: true, email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false });
  }
});

























app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

