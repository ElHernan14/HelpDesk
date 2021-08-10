'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Solicitud extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Solicitud.belongsTo(models.Cliente,{foreignKey:"dni_cliente"});
      Solicitud.belongsToMany(models.Area,{through:"Historial",foreignKey:"id_solicitud"});
      Solicitud.belongsToMany(models.Empleado,{through:"Historial",foreignKey:"id_solicitud"});
      Solicitud.hasMany(models.Historial,{foreignKey:'id_solicitud'});
    }
  };
  Solicitud.init({
    id_solicitud: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ticket: DataTypes.BIGINT,
    prioridad: DataTypes.STRING,
    fecha_solicitud: DataTypes.DATE,
    detalle: DataTypes.STRING,
    tipo: DataTypes.STRING,
    dni_cliente: DataTypes.BIGINT
  }, {
    sequelize,
    tableName: 'solicitudes',
    modelName: 'Solicitud',
    createdAt: false,
    updatedAt: false,
  });
  return Solicitud;
};