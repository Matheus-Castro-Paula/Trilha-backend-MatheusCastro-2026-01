"use strict";
const { Model } = require("sequelize");

/**
 * Representa os itens disponíveis no catálogo.
 * Possui um relacionamento 1:N com as avaliações (Reviews).
 */
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Define as associações da entidade.
     * Vincula o produto às suas respectivas avaliações.
     */
    static associate(models) {
      Product.hasMany(models.Review, {
        foreignKey: "productId",
        as: "reviews",
        onDelete: "CASCADE", // Se deletar o produto, remove as avaliações
      });
    }
  }

  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
    },
  );

  return Product;
};
