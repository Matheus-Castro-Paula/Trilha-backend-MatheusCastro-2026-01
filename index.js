/**
 * Ponto de entrada da API.
 * Configura o servidor Express, middlewares globais, rotas e
 * conexão com o banco de dados via Sequelize.
 */
const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API rodando com sucesso!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
