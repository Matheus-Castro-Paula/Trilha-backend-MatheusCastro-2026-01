const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/**
 * Controlador de autenticação.
 * Responsável pelo registro, login e recuperação de senha.
 */
class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: "Nome, e-mail e senha são obrigatórios.",
        });
      }

      const emailRegex = /\S+@\S+\.\S+/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Formato de e-mail inválido.",
        });
      }

      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({
          success: false,
          error: "E-mail já cadastrado!",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "default",
      });

      return res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso!",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Erro interno no servidor.",
      });
    }
  }

  /**
   * Autentica um usuário no sistema.
   * Valida credenciais e retorna um token JWT com expiração de 1 dia.
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "E-mail e senha são obrigatórios.",
        });
      }

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET não configurado.");
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "E-mail ou senha incorretos.",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "E-mail ou senha incorretos.",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso!",
        token,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Erro interno ao realizar login.",
      });
    }
  }

  /**
   * Solicitação de recuperação de senha.
   * Gera um token hexadecimal único válido por 1 hora e envia por e-mail.
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: "O e-mail é obrigatório.",
        });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(200).json({
          success: true,
          message: "Se o e-mail existir, as instruções foram enviadas.",
        });
      }

      const token = crypto.randomBytes(20).toString("hex");

      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 1);

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expiresIn;

      await user.save();

      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      });

      console.log(
        `[SIMULAÇÃO DE E-MAIL] Para redefinir a senha do ${email}, use o token: ${token}`,
      );

      await transporter.sendMail({
        from: '"API Comp Júnior" <nao-responda@compjunior.com.br>',
        to: email,
        subject: "Recuperação de Senha",
        text: `Você solicitou a recuperação de senha. Use este token: ${token}`,
      });

      return res.status(200).json({
        success: true,
        message: "Se o e-mail existir, as instruções foram enviadas.",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Erro ao processar solicitação de recuperação.",
      });
    }
  }

  /**
   * Redefinição de senha usando token.
   */
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: "Token e nova senha são obrigatórios.",
        });
      }

      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
        },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: "Token inválido.",
        });
      }

      const agora = new Date();

      if (agora > user.resetPasswordExpires) {
        return res.status(400).json({
          success: false,
          error: "Token expirado. Solicite a recuperação novamente.",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Senha redefinida com sucesso!",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Erro interno ao redefinir a senha.",
      });
    }
  }
}

module.exports = AuthController;
