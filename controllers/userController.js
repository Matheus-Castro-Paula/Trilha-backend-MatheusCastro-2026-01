const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/**
 * Controlador de usuários para registro, login e recuperação de senha.
 */
class UserController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: "E-mail já cadastrado!" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "default",
      });

      return res.status(201).json({
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
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  }

  /**
   * Autentica um usuário no sistema.
   * Valida credenciais e retorna um token JWT com expiração de 1 dia.
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ error: "E-mail ou senha incorretos." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      return res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno ao realizar login." });
    }
  }

  /**
   * Solicitação de recuperação de senha.
   * Gera um token hexadecimal único válido por 1 hora e envia por e-mail.
   */
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "E-mail não encontrado." });
      }

      // Token hexadecimal de 40 caracteres
      const token = crypto.randomBytes(20).toString("hex");

      // Define expiração por segurança (1 hora)
      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 1);

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expiresIn;
      await user.save();

      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
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
        message: "Se o e-mail existir, as instruções foram enviadas.",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao processar solicitação de recuperação." });
    }
  }

  /**
   * Redefinição de senha usando token.
   */
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const user = await User.findOne({ where: { resetPasswordToken: token } });

      if (!user) {
        return res.status(400).json({ error: "Token inválido." });
      }

      const agora = new Date();
      if (agora > user.resetPasswordExpires) {
        return res
          .status(400)
          .json({ error: "Token expirado. Solicite a recuperação novamente." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      return res.status(200).json({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro interno ao redefinir a senha." });
    }
  }
}

module.exports = UserController;
