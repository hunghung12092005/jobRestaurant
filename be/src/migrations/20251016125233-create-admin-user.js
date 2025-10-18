'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('123456Aa@', 10);

    await queryInterface.bulkInsert('users', [{
      username: 'admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'admin',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: 'admin' }, {});
  }
};
