const router = require("express").Router();

const { uploadProcess } = require("./uploadProcess/uploader");
const uploadCheck = require("../../validation/uploadCheck");

//Middleware
const authenticatedCheck = require("../../validation/AuthenticatedCheck");

//Upload sensor data
router.post(
  "/api/sensors/upload",
  [authenticatedCheck.check, uploadCheck],
  uploadProcess
);

module.exports = router;