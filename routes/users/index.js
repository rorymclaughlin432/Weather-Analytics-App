const router = require("express").Router();

//const register = require("../../database/schema/register");
const login = require("../../database/schema/login");
const { loginProcess }= require("./login/login");
//const registrationProcess = require("./register/register");

//Middleware
const validationCheck = require("../../validation/ValidationCheck");

//Added in a register route for testing purposes
/* router.post(
  "/api/register",
  [validationCheck.verify(register)],
  registrationProcess
); */

// Login route
router.post(
  "/api/login",
  [validationCheck.verify(login)],
  loginProcess
);

module.exports = router;