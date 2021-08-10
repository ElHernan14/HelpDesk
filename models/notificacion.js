'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notificacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notificacion.belongsTo(models.Historial,{foreignKey:'id_solicitud_historial'});
      Notificacion.belongsTo(models.Historial,{foreignKey:'id_area_historial'});
      Notificacion.belongsTo(models.Historial,{foreignKey:'fecha_historial'});
    }
  };
  Notificacion.init({
    id_notificacion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: DataTypes.DATE,
    descripcion: DataTypes.STRING,
    estado: DataTypes.STRING,
    fecha_historial: DataTypes.DATE,
    id_solicitud_historial: DataTypes.INTEGER,
    id_area_historial: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'notificaciones',
    modelName: 'Notificacion',
    createdAt: false,
    updatedAt: false,
  });
  return Notificacion;
};