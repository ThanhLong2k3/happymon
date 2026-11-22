import express from "express";

export function createProductsRouter({ database, adminAuthMiddleware }) {
  const router = express.Router();

  function getProductPayload(body = {}) {
    const sizes =
      typeof body.sizes === "string"
        ? [...new Set(body.sizes.split(",").map((size) => size.trim()).filter(Boolean))]
        : [];
    return {
      name: typeof body.name === "string" ? body.name.trim() : "",
      slug: typeof body.slug === "string" ? body.slug.trim() : "",
      category:
        typeof body.category === "string" ? body.category.trim() : "Đồng phục",
      price: Number(body.price),
      description:
        typeof body.description === "string" ? body.description.trim() : "",
      imageUrl:
        typeof body.imageUrl === "string" ? body.imageUrl.trim() : "",
      sizes: sizes.join(", "),
      inStock: body.inStock === undefined ? true : body.inStock,
    };
  }
  
  function isValidProduct(product) {
    return (
      product.name.length >= 2 &&
      product.name.length <= 500 &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(product.slug) &&
      product.slug.length <= 200 &&
      product.category.length <= 100 &&
      Number.isFinite(product.price) &&
      product.price > 0 &&
      product.price <= 9999999999.99 &&
      product.description.length <= 10000 &&
      product.imageUrl.length <= 500 &&
      product.sizes.length <= 255 &&
      typeof product.inStock === "boolean"
    );
  }
  
  router.get("/", adminAuthMiddleware, async (_request, response, next) => {
    try {
      const [rows] = await database.query(
        "SELECT id, name, slug, category, price, description, image_url AS imageUrl, sizes, in_stock AS inStock FROM products ORDER BY category ASC, name ASC, id ASC",
      );
      response.json(rows);
    } catch (error) {
      next(error);
    }
  });
  
  router.post("/", adminAuthMiddleware, async (request, response, next) => {
    const product = getProductPayload(request.body);
    if (!isValidProduct(product)) {
      response.status(400).json({ error: "Vui lòng kiểm tra thông tin sản phẩm." });
      return;
    }
  
    try {
      const [result] = await database.execute(
        "INSERT INTO products (name, slug, category, price, description, image_url, sizes, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          product.name,
          product.slug,
          product.category || "Đồng phục",
          product.price,
          product.description || null,
          product.imageUrl || null,
          product.sizes,
          product.inStock ? 1 : 0,
        ],
      );
      response.status(201).json({ id: result.insertId, message: "Đã thêm sản phẩm." });
    } catch (error) {
      next(error);
    }
  });
  
  router.put("/:id", adminAuthMiddleware, async (request, response, next) => {
    const product = getProductPayload(request.body);
    if (!isValidProduct(product) || !/^\d+$/.test(request.params.id)) {
      response.status(400).json({ error: "Vui lòng kiểm tra thông tin sản phẩm." });
      return;
    }
  
    try {
      const [result] = await database.execute(
        "UPDATE products SET name = ?, slug = ?, category = ?, price = ?, description = ?, image_url = ?, sizes = ?, in_stock = ? WHERE id = ?",
        [
          product.name,
          product.slug,
          product.category || "Đồng phục",
          product.price,
          product.description || null,
          product.imageUrl || null,
          product.sizes,
          product.inStock ? 1 : 0,
          request.params.id,
        ],
      );
      if (!result.affectedRows) {
        response.status(404).json({ error: "Không tìm thấy sản phẩm." });
        return;
      }
      response.json({ message: "Đã cập nhật sản phẩm." });
    } catch (error) {
      next(error);
    }
  });
  
  router.delete("/:id", adminAuthMiddleware, async (request, response, next) => {
    try {
      const [result] = await database.execute(
        "DELETE FROM products WHERE id = ?",
        [request.params.id],
      );
      if (!result.affectedRows) {
        response.status(404).json({ error: "Không tìm thấy sản phẩm." });
        return;
      }
      response.json({ message: "Đã xóa sản phẩm." });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
