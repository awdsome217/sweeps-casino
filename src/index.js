import express from "express";
import pool from "./db.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

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
app.post("/auth/register", async (req, res) => {
  console.log("REGISTER BODY:", req.body);

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

