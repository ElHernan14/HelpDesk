'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Empleado extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Empleado.belongsToMany(models.Solicitud,{through:"Historial",foreignKey:"dni_empleado"});
      Empleado.belongsTo(models.Area,{foreignKey:"id_area"});
    }
  };
  Empleado.init({
    dni: {
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    mail: DataTypes.STRING,
    telefono: DataTypes.BIGINT,
    contraseña: DataTypes.STRING,
    id_area: DataTypes.INTEGER,
    estado: DataTypes.STRING,
    fecha: DataTypes.DATE
  }, {
    sequelize,
    tableName: 'empleados',
    modelName: 'Empleado',
    createdAt: false,
    updatedAt: false,
  });
  return Empleado;
};