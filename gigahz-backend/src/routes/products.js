// routes/products.js
import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/**
 * GET /api/products?category=cpu&socket=AM4&ramType=DDR4&formFactor=ATX&active=true
 */
router.get("/", async (req, res) => {
  try {
    let { category, socket, ramType, formFactor, active } = req.query;

    // normalize
    category = category ? String(category).toLowerCase().trim() : null;
    socket = socket ? String(socket).trim() : null;
    ramType = ramType ? String(ramType).trim().toUpperCase() : null; // DDR4/DDR5
    formFactor = formFactor ? String(formFactor).trim() : null;
    active = active ? String(active).toLowerCase().trim() : null;

    // ✅ allow known categories
    const allowed = new Set([
      "cpu",
      "motherboard",
      "ram",
      "storage",
      "casing", // frontend name
      "case",   // db slug
      "cooling",
      "psu",
      "gpu",
    ]);

    if (category && !allowed.has(category)) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // ✅ map casing -> case
    const dbCategory = category === "casing" ? "case" : category;

    const values = [];
    let i = 1;
    let where = "WHERE 1=1";

    if (dbCategory) {
      where += ` AND c.slug = $${i++}`;
      values.push(dbCategory);
    }

    // ✅ strict filters (only match rows that have the value)
    if (socket) {
      where += ` AND p.socket = $${i++}`;
      values.push(socket);
    }

    if (ramType) {
      where += ` AND p.ram_type = $${i++}`;
      values.push(ramType);
    }

    if (formFactor) {
      where += ` AND p.form_factor = $${i++}`;
      values.push(formFactor);
    }

    // ✅ active filter supports true/false
    if (active === "true") where += ` AND p.is_active = true`;
    if (active === "false") where += ` AND p.is_active = false`;

    const sql = `
      SELECT
        p.*,
        c.slug AS category_slug,
        c.name AS category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${where}
      ORDER BY p.id DESC
    `;

    const { rows } = await pool.query(sql, values);
    res.json(rows);
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
