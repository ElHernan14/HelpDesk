'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Historial.belongsTo(models.Solicitud,{foreignKey:"id_solicitud"});
      Historial.belongsTo(models.Empleado,{foreignKey:"dni_empleado"});
      Historial.belongsTo(models.Area,{foreignKey:"id_area"});
      Historial.hasMany(models.Notificacion,{foreignKey:'id_solicitud_historial'});
      Historial.hasMany(models.Notificacion,{foreignKey:'id_area_historial'});
      Historial.hasMany(models.Notificacion,{foreignKey:'fecha_historial'});
      Historial.belongsTo(models.Solicitud);
    }
  };
  Historial.init({
    fecha_ingreso: DataTypes.DATE,
    estado: DataTypes.STRING,
    detalle_razon: DataTypes.STRING,
    detalle_solucion: DataTypes.STRING,
    id_area: DataTypes.INTEGER,
    id_solicitud: DataTypes.INTEGER,
    dni_empleado: DataTypes.BIGINT,
    fecha_egreso: DataTypes.DATE
  }, {
    sequelize,
    tableName:'historiales',
    modelName: 'Historial',
    createdAt: false,
    updatedAt: false,
  });
  return Historial;
};