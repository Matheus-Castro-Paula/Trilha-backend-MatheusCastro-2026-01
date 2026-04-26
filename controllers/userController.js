const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

class UserController {
  // função de criar usuário
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // verifica se o usuário já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: "E-mail já cadastrado!" });
      }

      // criptografa a senha com bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // cria o usuário no banco
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "default",
      });

      // retorna sucesso (ocultando a senha da resposta)
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

  // função de login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // procura o usuário pelo e-mail
      const user = await User.findOne({ where: { email } });

      // se o usuário não existir, devolve erro 404 (Not Found)
      if (!user) {
        return res.status(404).json({ error: "E-mail ou senha incorretos." });
      }

      // compara a senha digitada com a senha do banco (criptografada)
      const isPasswordValid = await bcrypt.compare(password, user.password);

      // se a senha estiver errada, devolve erro 401 (Unauthorized)
      if (!isPasswordValid) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      // gera o Crachá (Token) caso a senha esteja correta
      const token = jwt.sign(
        { id: user.id, role: user.role }, // dados que vão dentro do token
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      // devolve a resposta de sucesso com o Token
      return res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno ao realizar login." });
    }
  }

  // função de recuperação de senha
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // verifica se o usuário existe no banco
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "E-mail não encontrado." });
      }

      // gera um token aleatório
      const token = crypto.randomBytes(20).toString("hex");

      // define a validade
      const expiresIn = new Date();
      expiresIn.setHours(expiresIn.getHours() + 1);

      // salva o token e a validade no banco
      user.resetPasswordToken = token;
      user.resetPasswordExpires = expiresIn;
      await user.save();

      // configura o transporte do e-mail
      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      });

      // simula o envio do e-mail (no console) e depois envia o e-mail real
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

  // função de redefinir a senha
  static async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      // busca o usuário que tem esse token exato no banco
      const user = await User.findOne({ where: { resetPasswordToken: token } });

      // se não achar o usuário, o token não existe ou está errado
      if (!user) {
        return res.status(400).json({ error: "Token inválido." });
      }

      // verifica se o token já passou da validade
      const agora = new Date();
      if (agora > user.resetPasswordExpires) {
        return res
          .status(400)
          .json({ error: "Token expirado. Solicite a recuperação novamente." });
      }

      // criptografa a nova senha com bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // atualiza a senha do usuário, e limpa o token e a validade
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
