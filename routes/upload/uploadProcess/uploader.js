const { uploadService } = require("../../../services/uploadService.service");
//Upload process function
const uploadProcess = async (req, res) => {
  try {

    //Check if email and password are provided
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Email and password are required fields.",
        },
      });
    }

    //check if file is empty
    if (req.file == undefined) {
      return res.status(400).send({
        status: false,
        error: {
          message: "CSV file not found or not csv file type. Invalid",
        },
      });
    }

    //Upload sensor data
    const csvOutput = await uploadService(req, res);

    //If upload is not successful, return false with error for csv data
    if (csvOutput.success === false) {
      return await res.status(400).send({
        status: false,
        error: {
          message: csvOutput.message,
        },
      });
    } else {
      return await res.status(200).send({
        status: true,
        message: `${req.file.originalname} uploaded successfully.`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: `Internal Server Error - Could not upload the file: ${req.file.originalname}`,
    });
  }
};

module.exports = { uploadProcess };
