'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('contacts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Contact name',
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      comment: 'Contact email',
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Contact phone number',
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Message content',
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('contacts');
}
