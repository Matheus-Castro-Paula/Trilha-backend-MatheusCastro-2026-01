const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// rota de cadastro de usuário
router.post("/", UserController.register);

// rota de login de usuário
router.post("/login", UserController.login);

// rota de recuperação de senha
router.post("/forgot-password", UserController.forgotPassword);

// rota para o usuário enviar o token e a nova senha
router.post("/reset-password", UserController.resetPassword);

module.exports = router;
