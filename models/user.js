"use strict";
const { Model } = require("sequelize");

/**
 * Representa os usuários do sistema, diferenciando entre clientes (default) e administradores (admin).
 * Gerencia credenciais de acesso e dados de recuperação de senha.
 */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Define as associações da entidade.
     * Um usuário pode possuir diversas avaliações (Reviews).
     */
    static associate(models) {
      User.hasMany(models.Review, { foreignKey: "userId", as: "reviews" });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("default", "admin"),
        defaultValue: "default",
      },
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpires: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    },
  );

  return User;
};
