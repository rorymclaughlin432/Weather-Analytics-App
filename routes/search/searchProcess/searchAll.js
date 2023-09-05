const { searchAllService } = require("../../../services/searchAllService.service");

/**
 * search process to retrieve all sensors
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const searchAllProcess = async (req, res) => {
  try {

    //Search all sensors
    const sensorData = await searchAllService();

    //If search is not successful, return false with error for sensor data
    if (sensorData.success === false) {
      return res.status(400).send({
        status: false,
        error: {
          message: "Could not retrieve sensor data."
        },
      });      
    } else {
      return await res.send(sensorData);
    }

  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not retrieve sensor data.",
    });
  }
};

module.exports = { searchAllProcess };
