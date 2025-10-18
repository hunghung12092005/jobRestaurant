'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reservations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {              // Customer name
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {             // Phone number
        type: Sequelize.STRING,
        allowNull: false,
      },
      people: {            // Number of people
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date: {              // Reservation date
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time: {              // Reservation time
        type: Sequelize.TIME,
        allowNull: false,
      },
      message: {           // Optional message
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reservations');
  },
};
