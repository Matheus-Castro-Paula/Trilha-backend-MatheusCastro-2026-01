const isAdmin = (req, res, next) => {
  // req.user já foi preenchido pelo authMiddleware
  // checa se o cargo é diferente de admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error:
        "Acesso restrito. Apenas administradores podem realizar esta ação.",
    });
  }

  return next();
};

module.exports = isAdmin;
