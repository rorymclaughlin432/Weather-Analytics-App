const { loginService } = require("../../../services/loginService.service");

/**
 * passing the email and password in to the login service
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const loginProcess = async (req, res) => {
  try {

    //Check if email and password are provided
    if (req.body.email && req.body.password) {

      //proceed with login
      const data = await loginService(req.body);
      
      //if login is successful, return true with token
      if (data.success === true) {
        return await res.status(200).json({
          status: true,
          token: data.token,
        });
      } else if (data.success === false) {
        return await res.status(400).json({
          status: false,
          error: {
            message: data.error.message,
          },
        });
      }
    } else {
      return await res.status(400).json({
        status: false,
        error: {
          message: "Email and password are required.",
        },
      });
    }
  } catch (err) {
    return await res.status(500).json({
      status: false,
      error: {
        message: "Internal server error.",
      },
    });
  }
};

module.exports = { loginProcess };