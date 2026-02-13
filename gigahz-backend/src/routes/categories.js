import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, slug, name FROM categories ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /api/categories error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
