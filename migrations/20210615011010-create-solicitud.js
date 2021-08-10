'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Solicitudes', {
      id_solicitud: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticket: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      prioridad: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fecha_solicitud: {
        allowNull: false,
        type: Sequelize.DATE
      },
      detalle: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tipo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dni_cliente: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Clientes', key: 'dni' }
      },                      
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Solicitudes');
  }
};