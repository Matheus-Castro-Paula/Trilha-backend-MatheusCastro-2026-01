const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const uploadImage = require("../middlewares/uploadMiddleware"); // Importa a função pronta!

// Rotas públicas de Produtos (/products)
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);

// Rotas privadas de Produtos (admin) (/products)
router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadImage,
  ProductController.create,
);

router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  uploadImage,
  ProductController.update,
);

router.delete("/:id", authMiddleware, isAdmin, ProductController.remove);

module.exports = router;
