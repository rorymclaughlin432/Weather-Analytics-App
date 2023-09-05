const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserRepo = require("../database/repos/user.repo");

const { jwtSecret, jwtExpirationInSeconds } = require("../config");

/**
 * Generates an Access Token using email and userId for the user's authentication
 * @param {*} email 
 * @param {*} userId 
 * @returns 
 */
const generateAccessToken = async (email, userId) => {
  return jwt.sign(
    {
      userId,
      email,
    },
    jwtSecret,
    {
      expiresIn: jwtExpirationInSeconds,
    }
  );
};

/**
 * Encrypts the password via sha256
 * @param {*} password 
 * @returns 
 */
const encryptPassword = async (password) => {
  // Create a hash object
  const hash = crypto.createHash("sha256");
  //  Pass data to be hashed and updae hash object
  hash.update(password);
  // Get the hashed value in hex format
  return hash.digest("hex");
};

/**
 * running the login credentials through the validation process then generating an access token
 * @param {*} loginCreds 
 * @returns 
 */
const loginService = async (loginCreds) => {
  try {
    const { email, password } = loginCreds;

    // Validate and sanitize user input
    if (!email || !password) {
      return {
        success: false,
        error: {
          message: "Invalid - Email and password are required.",
        },
      };
    }

    const user = await UserRepo.findUser({ email });

    // IF No user found with the provided email
    // THEN Return user not found error
    if (!user) {
      return {
        success: false,
        error: {
          message: `Could not find any user with email: ${email}`,
        },
      };
    }

    const encryptedPassword = await encryptPassword(password);

    // IF password doesnt match then error out
    if (user.password !== encryptedPassword) {
      return {
        success: false,
        error: {
          message: `Provided email and password did not match.`,
        },
      };
    }

    // Generate token for the user, which they will use for authentication
    const accessToken = await generateAccessToken(user.email, user.id);

    if(!accessToken) {
        return {
            success: false,
            error: {
                message: "Could not generate access token."
            }
        }
    }

    if (user.id) {
      return {
        success: true,
        token: accessToken,
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

module.exports = { loginService };
