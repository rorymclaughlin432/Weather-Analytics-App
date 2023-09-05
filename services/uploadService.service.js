const SensorRepo = require("../database/repos/sensor.repo");
const fs = require("fs");
const csvtojson = require("csvtojson");

/**
 * running the csv file through the validation process then uploading the data into the database via readstream
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const uploadService = async (req, res) => {
  try {
    const csvFile = req.file.filename;
    const csvPath = "./storage/csv/" + csvFile;

    // check if file exists
    if (!fs.existsSync(csvPath)) {
      return res.status(400).send({
        status: false,
        error: {
          message: "File does not exist.",
        },
      });
    }

    //reading in csv file to be validated
    const readstream = fs.createReadStream(csvPath);

    //validate file
    const fileValidation = await validateFile(readstream);

    //check if file is validated
    if (!fileValidation) {
      return {
        success: false,
        error: {
          message: "Error - File invalid.",
        },
      };
    }

    //readstream events for csv file
    readstream.on("open", () => {
      console.log(`${csvFile} is open`);
    });

    readstream.on("error", (error) => {
      return {
        success: false,
        error: {
          message: "Error - Fail to import data into database.",
        },
      };
    });

    readstream.on("data", () => {
      //csv data enters sqlite database
      SensorRepo.bulkCreate(fileValidation);
    });
    readstream.on("finish", () => {
        console.log(`${csvFile} is finished`);
    });
    readstream.on("end", () => {
      console.log(`${csvFile} is closed`);
    });
    return {
      success: true,
      message: `${req.file.originalname} uploaded successfully.`,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        message: "Internal server error.",
      },
    };
  }
};

/**
 *  validate the csv file through the headers and schema checks
 * @param {*} csvFile 
 * @returns 
 */

const validateFile = async (csvFile) => {
  
    //check for headers
    const fileRows = await csvtojson().fromFile(csvFile.path);
  
    //check if file is empty
    if (fileRows.length === 0) {
      return false;
    }
  
    //check headers are correct via schema
    const headers = Object.keys(fileRows[0]).map((header) => header.split(','));
  
    //check if required headers are in splitHeaders
    const requiredHeaders = ["timestamp", "temperature", "rainfall", "humidity", "wind_speed", "visibility"];
    const missingHeaders = requiredHeaders.filter((requiredHeader) => !headers.some((header) => header.includes(requiredHeader)));
  
    //if missingHeaders is not empty, return false
    if (missingHeaders.length > 0) {
      return false;
    }
  
    return fileRows;
  }

module.exports = { uploadService, validateFile };
