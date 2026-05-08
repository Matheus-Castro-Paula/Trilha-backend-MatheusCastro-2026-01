const { User } = require("../models");

class UserController {
  /**
   * [GET] Lista todos os usuários (admin).
   * Rota privada.
   */
  static async getAll(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role", "createdAt"],
        order: [["createdAt", "DESC"]],
      });

      return res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Erro ao buscar usuários.",
      });
    }
  }

  /**
   * [GET] Busca um usuário específico pelo ID (admin).
   * Rota privada.
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "ID inválido.",
        });
      }

      const user = await User.findByPk(id, {
        attributes: ["id", "name", "email", "role", "createdAt"],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado",
        });
      }

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Erro ao buscar o usuário.",
      });
    }
  }

  /**
   * [GET] Obter os detalhes do usuário autenticado.
   * Rota privada.
   */
  static async getMe(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        attributes: ["id", "name", "email", "role"],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado.",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, error: "Erro ao buscar usuário autenticado." });
    }
  }

  /**
   * [PUT] Atualizar os detalhes de um usuário específico (admin).
   * Rota privada.
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      if (email !== undefined) {
        const emailRegex = /\S+@\S+\.\S+/;

        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            error: "Formato de e-mail inválido.",
          });
        }
      }

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "ID inválido.",
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado.",
        });
      }

      if (email !== undefined) {
        const emailAlreadyExists = await User.findOne({
          where: { email },
        });

        if (emailAlreadyExists && emailAlreadyExists.id !== user.id) {
          return res.status(400).json({
            success: false,
            error: "Este e-mail já está em uso.",
          });
        }
      }

      // Atualiza apenas os campos enviados
      const updatedData = {};

      if (name !== undefined) updatedData.name = name;
      if (email !== undefined) updatedData.email = email;
      if (role !== undefined) updatedData.role = role;

      await user.update(updatedData);

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Erro ao atualizar o usuário.",
      });
    }
  }

  /**
   * [DELETE] Excluir um usuário específico (admin).
   * Rota privada.
   */
  static async remove(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "ID inválido.",
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado.",
        });
      }

      if (Number(id) === req.user.id) {
        return res.status(400).json({
          success: false,
          error: "Você não pode excluir sua própria conta",
        });
      }

      await user.destroy();

      return res.status(200).json({
        success: true,
        message: "Usuário deletado com sucesso!",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Erro ao deletar o usuário.",
      });
    }
  }
}

module.exports = UserController;
