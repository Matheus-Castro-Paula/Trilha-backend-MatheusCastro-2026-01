"use strict";
const bcrypt = require("bcryptjs");

/** * Seeder para criação do usuário Administrador inicial do sistema.
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

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
    await queryInterface.bulkDelete("Users", { email: "admin@admin.com" }, {});
  },
};
