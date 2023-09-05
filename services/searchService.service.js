const SensorRepo = require("../database/repos/sensor.repo");
const searchService = async (req, res) => {
  try {
    const { body: searchOptions } = req;

    const sensorSearchOutput = await SensorRepo.queryAllSensors(searchOptions);

    if (!sensorSearchOutput) {
      return {
        success: false,
        error: {
          message: "Could not retrieve sensor data.",
        },
      };
    } else {
      return {
        success: true,
        data: sensorSearchOutput,
      };
    }
    
  } catch (err) {
    return {
      success: false,
      error: {
        message: "Internal server error.",
      },
    };
  }
};

module.exports = { searchService };
