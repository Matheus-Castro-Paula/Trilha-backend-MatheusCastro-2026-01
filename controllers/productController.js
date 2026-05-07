const { Product } = require("../models");

/**
 * Controlador de Produtos.
 * Responsável pelo CRUD do catálogo de produtos.
 */

class ProductController {
  /**
   * [POST] Cria um novo produto.
   * Rota restrita para administradores.
   */
  static async create(req, res) {
    try {
      const { name, description, price, stock } = req.body;

      if (!name || price === undefined) {
        return res.status(400).json({
          error: "Nome e preço são obrigatórios.",
        });
      }

      if (typeof price !== "number" || price < 0) {
        return res.status(400).json({
          error: "O preço deve ser um número positivo.",
        });
      }

      if (stock !== undefined && (typeof stock !== "number" || stock < 0)) {
        return res.status(400).json({
          error: "O estoque deve ser um número positivo.",
        });
      }

      const newProduct = await Product.create({
        name,
        description,
        price,
        stock,
      });

      return res.status(201).json({
        message: "Produto criado com sucesso!",
        product: {
          id: newProduct.id,
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          stock: newProduct.stock,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro interno ao criar produto.",
      });
    }
  }

  /**
   * [GET] Lista todos os produtos.
   * Rota pública.
   */
  static async getAll(req, res) {
    try {
      const products = await Product.findAll();

      return res.status(200).json(products);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao buscar produtos.",
      });
    }
  }

  /**
   * [GET] Busca um produto específico pelo ID.
   * Rota pública.
   */
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          error: "Produto não encontrado.",
        });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao buscar o produto.",
      });
    }
  }

  /**
   * [PUT] Atualiza os dados de um produto existente através do ID.
   * Rota restrita para administradores.
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, price, stock } = req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          error: "Produto não encontrado.",
        });
      }

      if (price !== undefined) {
        if (typeof price !== "number" || price < 0) {
          return res.status(400).json({
            error: "O preço deve ser um número positivo.",
          });
        }
      }

      if (stock !== undefined) {
        if (typeof stock !== "number" || stock < 0) {
          return res.status(400).json({
            error: "O estoque deve ser um número positivo.",
          });
        }
      }

      // Atualiza apenas os campos enviados
      const updatedData = {};

      if (name !== undefined) updatedData.name = name;
      if (description !== undefined) updatedData.description = description;
      if (price !== undefined) updatedData.price = price;
      if (stock !== undefined) updatedData.stock = stock;

      await product.update(updatedData);

      return res.status(200).json({
        message: "Produto atualizado com sucesso!",
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao atualizar o produto.",
      });
    }
  }

  /**
   * [DELETE] Remove um produto do catálogo através do ID.
   * Rota restrita para administradores.
   */
  static async remove(req, res) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({
          error: "Produto não encontrado.",
        });
      }

      await product.destroy();

      return res.status(200).json({
        message: "Produto deletado com sucesso!",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: "Erro ao deletar o produto.",
      });
    }
  }
}

module.exports = ProductController;
