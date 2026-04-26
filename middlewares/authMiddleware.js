const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // verifica se o usuário mandou o cabeçalho de autorização
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });
  }

  // o token padrão vem no formato: "Bearer eyJhbGci..."
  // o split separa a palavra "Bearer"
  const [, token] = authHeader.split(" ");

  try {
    // verifica se o token é válido usando o JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // se for válido, anexa os dados do usuário na requisição
    req.user = decoded;

    return next();
  } catch (error) {
    // se o token for inválido ou expirado, retorna erro
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

module.exports = authMiddleware;
