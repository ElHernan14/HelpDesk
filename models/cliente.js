'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cliente.hasMany(models.Solicitud,{foreignKey:"dni_cliente"});
    }
  };
  Cliente.init({
    dni: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    mail: DataTypes.STRING,
    celular: DataTypes.INTEGER,
    contraseña: DataTypes.STRING,
    fecha: DataTypes.DATE,
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'clientes',
    modelName: 'Cliente',
    createdAt: false,
    updatedAt: false,
  });
  return Cliente;
};