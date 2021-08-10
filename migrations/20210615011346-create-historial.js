'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Historiales', {
      fecha_ingreso: {
        primaryKey: true,
        type: Sequelize.DATE
      },
      estado: {
        allowNull: false,
        type: Sequelize.STRING
      },
      detalle_razon: {
        allowNull: false,
        type: Sequelize.STRING
      },
      detalle_solucion: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      id_area: {
        type: Sequelize.INTEGER,
        references: { model: 'Areas', key: 'id_area' },
        primaryKey: true,
      },
      id_solicitud: {
        type: Sequelize.INTEGER,
        references: { model: 'Solicitudes', key: 'id_solicitud'},
        primaryKey: true,
      },
      dni_empleado: {
        type: Sequelize.BIGINT,
        references: { model: 'Empleados', key: 'dni'},
        allowNull: true,
      },
      fecha_egreso: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Historiales');
  }
};