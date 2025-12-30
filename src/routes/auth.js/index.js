import express from "express";
import bcryptjs from "bcryptjs";
import pool from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, sc_balance",
      [email, hash]
    );

    res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

}catch(err){
  console.error("REGISTER ERROR:"err);
  console.error("STACK:"err?.stack);
  res.status(500).json({error:"Registration failed"});
}











export default router;
