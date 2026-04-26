"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // criptografa a senha padrão
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // insere o usuário direto na tabela 'Users'
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Administrador do Sistema",
          email: "admin@admin.com",
          password: hashedPassword,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    // se necessário desfazer o seed, remove o usuário criado
    await queryInterface.bulkDelete("Users", { email: "admin@admin.com" }, {});
  },
};
