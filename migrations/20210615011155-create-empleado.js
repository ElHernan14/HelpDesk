'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Empleados', {
      dni: {
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING
      },
      apellido: {
        allowNull: false,
        type: Sequelize.STRING
      },
      mail: {
        allowNull: false,
        type: Sequelize.STRING
      },
      telefono: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      contraseña: {
        allowNull: false,
        type: Sequelize.STRING
      },
      id_area: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Areas', key: 'id_area' },
      },
      estado: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fecha: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Empleados');
  }
};