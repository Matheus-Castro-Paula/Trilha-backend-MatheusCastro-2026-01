const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");

//Rotas públicas de autenticação de usuários (/auth).
router.post("/", AuthController.register);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
