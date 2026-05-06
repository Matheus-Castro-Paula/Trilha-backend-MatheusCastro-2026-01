const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

/**
 * Rotas públicas de gerenciamento de usuários e autenticação.
 */
router.post("/", UserController.register);
router.post("/login", UserController.login);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);

module.exports = router;
