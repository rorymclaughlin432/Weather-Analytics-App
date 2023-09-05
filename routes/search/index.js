const router = require("express").Router();

const { searchAllProcess }= require("./searchProcess/searchAll");
const { searchProcess } = require("./searchProcess/search");

//Middleware
const authenticatedCheck = require("../../validation/AuthenticatedCheck");

//Search all sensors
router.post(
  "/api/sensors/searchAll",
  [authenticatedCheck.check],
  searchAllProcess
);

//Search sensors with filters/sort/aggregate options
router.post(
  "/api/sensors/search",
  [authenticatedCheck.check],
  searchProcess
);

module.exports = router;