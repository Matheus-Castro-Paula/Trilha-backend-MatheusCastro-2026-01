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
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar usuário autenticado.",
      });
    }
  }

  /**
   * [PUT] Atualizar os detalhes de um usuário.
   * Rota privada (dono do perfil ou Admin).
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      const userLoggedId = req.user.id;
      const userRole = req.user.role;

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: "ID inválido.",
        });
      }

      const userToUpdate = await User.findByPk(id);
      if (!userToUpdate) {
        return res.status(404).json({
          success: false,
          error: "Usuário não encontrado.",
        });
      }
      if (userToUpdate.id !== userLoggedId && userRole !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Você só tem permissão para atualizar o seu próprio perfil.",
        });
      }

      if (role !== undefined) {
        const validRoles = ["default", "admin"];

        if (!validRoles.includes(role)) {
          return res.status(400).json({
            success: false,
            error:
              "Opção de role inválida. As únicas permitidas são: 'default' ou 'admin'.",
          });
        }

        if (userRole !== "admin") {
          return res.status(403).json({
            success: false,
            error: "Você não tem permissão para alterar cargo.",
          });
        }
      }

      if (email !== undefined) {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({
            success: false,
            error: "Formato de e-mail inválido.",
          });
        }

        const emailAlreadyExists = await User.findOne({ where: { email } });
        if (emailAlreadyExists && emailAlreadyExists.id !== userToUpdate.id) {
          return res.status(400).json({
            success: false,
            error: "Este e-mail já está em uso.",
          });
        }
      }

      const updatedData = {};
      if (name !== undefined) updatedData.name = name;
      if (email !== undefined) updatedData.email = email;
      if (role !== undefined) updatedData.role = role;

      await userToUpdate.update(updatedData);

      return res.status(200).json({
        success: true,
        message: "Perfil atualizado com sucesso.",
        data: {
          id: userToUpdate.id,
          name: userToUpdate.name,
          email: userToUpdate.email,
          role: userToUpdate.role,
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
