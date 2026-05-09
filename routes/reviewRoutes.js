const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/authMiddleware");

// Rotas públicas de reviews (/reviews).
router.get("/product/:productId", ReviewController.getByProduct);

// Rotas privadas de reviews (/reviews).
router.post("/", authMiddleware, ReviewController.create);
router.put("/:id", authMiddleware, ReviewController.update);

/**
 * Rotas privadas de reviews (default e admin) (/reviews).
 * Usuários comuns conseguem deletar apenas as próprias reviews.
 * Administradores conseguem deletar qualquer review.
 */
router.delete("/:id", authMiddleware, ReviewController.remove);

module.exports = router;
