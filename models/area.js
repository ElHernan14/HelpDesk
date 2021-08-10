'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Area extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Area.belongsToMany(models.Solicitud,{through:"Historial",foreignKey:"id_area"});
      Area.hasMany(models.Empleado,{foreignKey:"id_area"});
    }
  };
  Area.init({
    id_area: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_area: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Area',
    tableName: 'areas',
    createdAt: false,
    updatedAt: false,
  });
  return Area;
};