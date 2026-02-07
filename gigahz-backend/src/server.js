import express from "express";
import categoriesRouter from "./routes/categories.js";
import productsRouter from "./routes/products.js";
import buildsRouter from "./routes/builds.js";

const app = express();
app.use(express.json());

// simple CORS (no cors package)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/health", (req, res) => res.json({ ok: true, app: "GigaHz API" }));

app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/builds", buildsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`GigaHz backend running on :${PORT}`));
