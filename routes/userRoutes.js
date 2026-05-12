const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

// Rotas privadas de Usuários (/users)
router.get("/me", authMiddleware, UserController.getMe);

// Rotas privadas de Usuários (admin) (/users)
router.get("/", authMiddleware, isAdmin, UserController.getAll);
router.get("/:id", authMiddleware, isAdmin, UserController.getById);
router.delete("/:id", authMiddleware, isAdmin, UserController.remove);

/**
 * Rotas privadas de users (default e admin) (/users).
 * Usuários comuns conseguem atualizar apenas as próprias users.
 * Administradores conseguem atualizar qualquer user.
 */
router.put("/:id", authMiddleware, UserController.update);

module.exports = router;
