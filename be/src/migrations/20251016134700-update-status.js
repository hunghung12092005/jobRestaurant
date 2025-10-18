'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('reservations', 'status', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'pending', // mặc định là pending
    comment: 'Reservation status, e.g., pending, confirmed, canceled'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('reservations', 'status');
}
