'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notificaciones', {
      id_notificacion: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fecha: {
        allowNull: false,
        type: Sequelize.DATE
      },
      descripcion: {
        allowNull: false,
        type: Sequelize.STRING
      },
      estado: {
        allowNull: false,
        type: Sequelize.STRING
      },
      fecha_historial: {
        allowNull: false,
        references: { model: 'Historiales', key: 'fecha_ingreso'},
        type: Sequelize.DATE,
      },
      id_solicitud_historial: {
        allowNull: false,
        references: { model: 'Historiales', key: 'id_solicitud'},
        type: Sequelize.INTEGER,
      },
      id_area_historial: {
        allowNull: false,
        references: { model: 'Historiales', key: 'id_area'},
        type: Sequelize.INTEGER,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Notificaciones');
  }
};