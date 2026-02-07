import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

// Create build + items
router.post("/", async (req, res) => {
  const { name, items } = req.body; // items: [{productId, qty}]
  if (!name || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "name and items[] required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const b = await client.query("INSERT INTO builds (name) VALUES ($1) RETURNING id, name", [name]);
    const buildId = b.rows[0].id;

    for (const it of items) {
      await client.query(
        "INSERT INTO build_items (build_id, product_id, qty) VALUES ($1,$2,$3)",
        [buildId, Number(it.productId), Number(it.qty ?? 1)]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ buildId });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Failed to create build", detail: String(e.message || e) });
  } finally {
    client.release();
  }
});

// Fetch build with expanded products + total
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const build = await pool.query("SELECT id, name, created_at FROM builds WHERE id=$1", [id]);
  if (build.rowCount === 0) return res.status(404).json({ error: "Build not found" });

  const items = await pool.query(
    `
    SELECT
      bi.qty,
      p.id AS product_id,
      p.name,
      p.brand,
      p.price_lkr,
      p.image_url
    FROM build_items bi
    JOIN products p ON p.id = bi.product_id
    WHERE bi.build_id = $1
    `,
    [id]
  );

  const total = items.rows.reduce((sum, r) => sum + r.price_lkr * r.qty, 0);

  res.json({ ...build.rows[0], items: items.rows, total_lkr: total });
});

export default router;
