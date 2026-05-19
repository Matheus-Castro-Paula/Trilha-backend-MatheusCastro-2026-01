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

      if (!name || name.trim() === "" || price === undefined || price === "") {
        return res.status(400).json({
          success: false,
          error: "Nome e preço são obrigatórios.",
        });
      }

      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({
          sucess: false,
          error: "O preço deve ser um número positivo.",
        });
      }

      let parsedStock = stock;
      if (stock !== undefined && stock !== "") {
        parsedStock = Number(stock);
        if (isNaN(parsedStock) || parsedStock < 0) {
          return res.status(400).json({
            success: false,
            error: "O estoque deve ser um número positivo.",
          });
        }
      } else if (stock === "") {
        parsedStock = 0;
      }

      const image_url = req.file ? req.file.path : null;

      const newProduct = await Product.create({
        name,
        description,
        price: parsedPrice,
        stock: parsedStock,
        image_url,
      });

      return res.status(201).json({
        success: true,
        message: "Produto criado com sucesso!",
        product: {
          id: newProduct.id,
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          stock: newProduct.stock,
          image_url: newProduct.image_url,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
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
        success: false,
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
          success: false,
          error: "Produto não encontrado.",
        });
      }

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
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
          success: false,
          error: "Produto não encontrado.",
        });
      }

      const updatedData = {};

      if (name !== undefined) {
        if (name.trim() === "") {
          return res.status(400).json({
            success: false,
            error: "O nome do produto não pode ser vazio.",
          });
        }
        updatedData.name = name;
      }
      if (description !== undefined) updatedData.description = description;

      if (price !== undefined) {
        if (price === "") {
          return res.status(400).json({
            success: false,
            error: "O preço não pode ser vazio.",
          });
        }
        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          return res.status(400).json({
            success: false,
            error: "O preço deve ser um número positivo.",
          });
        }
        updatedData.price = parsedPrice;
      }

      if (stock !== undefined) {
        if (stock === "") {
          return res.status(400).json({
            success: false,
            error: "O estoque não pode ser vazio.",
          });
        }
        const parsedStock = Number(stock);
        if (isNaN(parsedStock) || parsedStock < 0) {
          return res.status(400).json({
            success: false,
            error: "O estoque deve ser um número positivo.",
          });
        }
        updatedData.stock = parsedStock;
      }

      if (req.file) {
        updatedData.image_url = req.file.path;
      }

      await product.update(updatedData);

      return res.status(200).json({
        success: true,
        message: "Produto atualizado com sucesso!",
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          image_url: product.image_url,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
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
          success: false,
          error: "Produto não encontrado.",
        });
      }

      await product.destroy();

      return res.status(200).json({
        success: true,
        message: "Produto deletado com sucesso!",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: "Erro ao deletar o produto.",
      });
    }
  }
}

module.exports = ProductController;
