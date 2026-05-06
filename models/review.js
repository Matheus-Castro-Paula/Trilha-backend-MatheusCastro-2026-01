"use strict";
const { Model } = require("sequelize");

/**
 * Representa a nota e o comentário de um usuário sobre um produto específico.
 * Atua como a tabela intermediária (com dados extras) entre Users e Products.
 */
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Define as associações da entidade.
     * Uma avaliação sempre pertence a um único Usuário (autor) e a um único Produto (alvo).
     */
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Review.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }

  Review.init(
    {
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Review",
      tableName: "Reviews",
    },
  );

  return Review;
};
