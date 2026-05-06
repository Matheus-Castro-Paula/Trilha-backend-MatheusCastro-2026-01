/**
 * Middleware de autorização baseado em níveis de acesso (RBAC).
 * Verifica se o usuário autenticado possui a role 'admin'.
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error:
        "Acesso restrito. Apenas administradores podem realizar esta ação.",
    });
  }

  return next();
};

module.exports = isAdmin;
