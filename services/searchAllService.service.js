const SensorRepo = require("../database/repos/sensor.repo");
const searchAllService = async (req, res) => {
  try {
    const sensorData = await SensorRepo.findAllSensors();
    
    if (!sensorData) {
    return {
      success: false,
      error: {
        message: "Could not retrieve sensor data.",
      },
    }
    } else {
      return {
        success: true,
        data: sensorData
      }
    }
  } catch (err) {
    return {
      success: false,
      error: {
        message: "Internal server error.",
      },
    }
  };
};

module.exports = { searchAllService };