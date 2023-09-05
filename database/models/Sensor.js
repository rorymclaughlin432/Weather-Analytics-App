const { DataTypes } = require("sequelize");

const SensorModel = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  timestamp: {
    type: DataTypes.STRING,
  },
  temperature: {
    type: DataTypes.INTEGER,
  },
  rainfall: {
    type: DataTypes.INTEGER,
  },
  humidity: {
    type: DataTypes.INTEGER,
  },
  wind_speed: {
    type: DataTypes.INTEGER,
  },
  visibility: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
};

module.exports = SensorModel;