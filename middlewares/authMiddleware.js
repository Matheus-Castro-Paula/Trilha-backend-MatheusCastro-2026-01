const jwt = require("jsonwebtoken");

/**
 * Intercepta a requisição para proteger rotas privadas.
 * Extrai e valida a assinatura do token JWT do cabeçalho Authorization.
 * Se válido, anexa o payload do usuário (id, role) no objeto req.user.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

module.exports = authMiddleware;
