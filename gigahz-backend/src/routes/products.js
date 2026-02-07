import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

/**
 * GET /api/products?category=cpu&socket=AM4&ramType=DDR4&active=true
 * Used by frontend BuildMyPC page to fetch lists.
 */
router.get("/", async (req, res) => {
  const { category, socket, ramType, formFactor, active } = req.query;

  const filters = [];
  const values = [];
  let i = 1;

  // category slug -> join categories
  let join = "JOIN categories c ON c.id = p.category_id";
  let where = "WHERE 1=1";

  if (category) {
    where += ` AND c.slug = $${i++}`;
    values.push(category);
  }
  if (socket) {
    where += ` AND (p.socket = $${i++} OR p.socket IS NULL)`;
    values.push(socket);
  }
  if (ramType) {
    where += ` AND (p.ram_type = $${i++} OR p.ram_type IS NULL)`;
    values.push(ramType);
  }
  if (formFactor) {
    where += ` AND (p.form_factor = $${i++} OR p.form_factor IS NULL)`;
    values.push(formFactor);
  }
  if (active === "true") {
    where += ` AND p.is_active = true`;
  }

  const sql = `
    SELECT
      p.*,
      c.slug AS category_slug,
      c.name AS category_name
    FROM products p
    ${join}
    ${where}
    ORDER BY p.id DESC
  `;

  const { rows } = await pool.query(sql, values);
  res.json(rows);
});

/**
 * ADMIN: Create product
 * POST /api/products
 */
router.post("/", async (req, res) => {
  const {
    categorySlug,
    brand,
    name,
    priceLkr,
    imageUrl,
    stockQty,
    socket,
    chipset,
    ramType,
    wattage,
    gpuLengthMm,
    formFactor,
    capacityGb,
    isActive,
  } = req.body;

  if (!categorySlug || !brand || !name || priceLkr == null) {
    return res.status(400).json({ error: "categorySlug, brand, name, priceLkr are required" });
  }

  const cat = await pool.query("SELECT id FROM categories WHERE slug=$1", [categorySlug]);
  if (cat.rowCount === 0) return res.status(400).json({ error: "Invalid categorySlug" });

  const categoryId = cat.rows[0].id;

  const sql = `
    INSERT INTO products (
      category_id, brand, name, price_lkr, image_url, stock_qty, is_active,
      socket, chipset, ram_type, wattage, gpu_length_mm, form_factor, capacity_gb
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,
      $8,$9,$10,$11,$12,$13,$14
    )
    RETURNING *
  `;

  const values = [
    categoryId,
    brand,
    name,
    Number(priceLkr),
    imageUrl || null,
    Number(stockQty ?? 0),
    Boolean(isActive ?? true),
    socket || null,
    chipset || null,
    ramType || null,
    wattage != null ? Number(wattage) : null,
    gpuLengthMm != null ? Number(gpuLengthMm) : null,
    formFactor || null,
    capacityGb != null ? Number(capacityGb) : null,
  ];

  const created = await pool.query(sql, values);
  res.status(201).json(created.rows[0]);
});

/**
 * ADMIN: Update product
 * PUT /api/products/:id
 */
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

  // update only fields provided
  const allowed = {
    brand: "brand",
    name: "name",
    priceLkr: "price_lkr",
    imageUrl: "image_url",
    stockQty: "stock_qty",
    isActive: "is_active",
    socket: "socket",
    chipset: "chipset",
    ramType: "ram_type",
    wattage: "wattage",
    gpuLengthMm: "gpu_length_mm",
    formFactor: "form_factor",
    capacityGb: "capacity_gb",
  };

  const sets = [];
  const values = [];
  let i = 1;

  for (const key of Object.keys(req.body)) {
    if (!allowed[key]) continue;
    sets.push(`${allowed[key]} = $${i++}`);
    values.push(req.body[key]);
  }

  if (sets.length === 0) return res.status(400).json({ error: "No valid fields to update" });

  values.push(id);
  const sql = `UPDATE products SET ${sets.join(", ")}, updated_at = now() WHERE id = $${i} RETURNING *`;
  const updated = await pool.query(sql, values);

  if (updated.rowCount === 0) return res.status(404).json({ error: "Product not found" });
  res.json(updated.rows[0]);
});

/**
 * ADMIN: Delete product
 * DELETE /api/products/:id
 */
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await pool.query("DELETE FROM products WHERE id=$1 RETURNING id", [id]);
  if (deleted.rowCount === 0) return res.status(404).json({ error: "Product not found" });
  res.json({ deleted: true, id });
});

export default router;
