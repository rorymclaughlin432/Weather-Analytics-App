const { searchService } = require("../../../services/searchService.service");

/**
 * search process to specify filters/sort/aggregate options
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const searchProcess = async (req, res) => {
  try {

    //Search sensors with filters/sort/aggregate options
    const sensorSearchOutput = await searchService(req);

    //If search is not successful, return false with error for sensor data
    if (sensorSearchOutput.success === false) {
      return await res.status(400).send({
        status: false,
        error: {
          message: "Could not retrieve sensor data."
        },
      });    
    } else {
      return await res.status(200).send({
        status: true,
        data: sensorSearchOutput.data
      });    
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not retrieve sensor data.",
    });
  }
};

module.exports = { searchProcess };
