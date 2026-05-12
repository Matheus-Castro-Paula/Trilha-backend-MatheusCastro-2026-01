const { Review, Product, User } = require("../models");

class ReviewController {
  /**
   * [POST] Cria uma nova avaliação para um produto.
   * Rota privada.
   */
  static async create(req, res) {
    try {
      const { productId, rating, comment } = req.body;
      const userId = req.user.id;

      if (!productId || rating === undefined) {
        return res.status(400).json({
          success: false,
          error: "Produto e nota (rating) são obrigatórios.",
        });
      }

      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: "A nota deve ser um número entre 1 e 5.",
        });
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Produto não encontrado.",
        });
      }

      const existingReview = await Review.findOne({
        where: {
          userId: userId,
          productId: productId,
        },
      });

      if (existingReview) {
        return res.status(409).json({
          success: false,
          error: "Você já avaliou este produto.",
          existingReview: existingReview,
        });
      }

      const newReview = await Review.create({
        rating,
        comment,
        userId,
        productId,
      });

      return res.status(201).json({
        success: true,
        message: "Avaliação enviada com sucesso!",
        data: newReview,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Erro interno ao criar avaliação.",
      });
    }
  }

  /**
   * [GET] Lista todas as avaliações de um produto específico.
   * Rota pública.
   */
  static async getByProduct(req, res) {
    try {
      const { productId } = req.params;

      if (isNaN(productId)) {
        return res.status(400).json({
          success: false,
          error: "ID de produto inválido.",
        });
      }

      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Produto não encontrado.",
        });
      }

      const reviews = await Review.findAll({
        where: { productId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar avaliações.",
      });
    }
  }

  /**
   * [PUT] Atualiza a própria avaliação.
   * Rota privada.
   */
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user.id;

      if (isNaN(id))
        return res.status(400).json({
          success: false,
          error: "ID inválido.",
        });

      const review = await Review.findByPk(id);

      if (!review)
        return res.status(404).json({
          success: false,
          error: "Avaliação não encontrada.",
        });

      if (review.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: "Você só pode editar as suas próprias avaliações.",
        });
      }

      if (
        rating !== undefined &&
        (typeof rating !== "number" || rating < 1 || rating > 5)
      ) {
        return res.status(400).json({
          success: false,
          error: "A nota deve ser um número entre 1 e 5.",
        });
      }

      await review.update({
        rating: rating !== undefined ? rating : review.rating,
        comment: comment !== undefined ? comment : review.comment,
      });

      return res.status(200).json({
        success: true,
        message: "Avaliação atualizada com sucesso!",
        data: review,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Erro ao atualizar a avaliação.",
      });
    }
  }

  /**
   * [DELETE] Remove uma avaliação.
   * Rota privada (dono da avaliação ou Admin).
   */
  static async remove(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      if (isNaN(id))
        return res.status(400).json({
          success: false,
          error: "ID inválido.",
        });

      const review = await Review.findByPk(id);

      if (!review)
        return res.status(404).json({
          success: false,
          error: "Avaliação não encontrada.",
        });

      // Dono ou Admin podem deletar
      if (review.userId !== userId && userRole !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Você não tem permissão para deletar esta avaliação.",
        });
      }

      await review.destroy();

      return res.status(200).json({
        success: true,
        message: "Avaliação deletada com sucesso!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: "Erro ao deletar a avaliação.",
      });
    }
  }
}

module.exports = ReviewController;
