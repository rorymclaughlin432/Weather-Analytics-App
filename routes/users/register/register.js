const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const UserModel = require("../../../database/models/User");

const { jwtSecret, jwtExpirationInSeconds } = require("../../../config");

// Generates an Access Token using email and userId for the user's authentication
const generateAccessToken = async (email, userId) => {
  return jwt.sign(
    {
      userId,
      email
    },
    jwtSecret,
    {
      expiresIn: jwtExpirationInSeconds,
    }
  );
};

// Encrypts the password 
const encryptPassword = async (password) => {
  // Create a hash object
  const hash = crypto.createHash("sha256");
  //  Pass data to be hashed and updae hash object
  hash.update(password);
  // Get the hashed value in hex format
  return hash.digest("hex");
};

module.exports = async (req, res) => {
    const payload = req.body;

    let encryptedPassword = await encryptPassword(payload.password);

    await UserModel.createUser(
      Object.assign(payload, { password: encryptedPassword })
    )
      .then(async (user) => {
        // Generating an AccessToken for the user, which will be
        // required in every subsequent request.
        const accessToken = await generateAccessToken(payload.email, user.id);

        return res.status(200).json({
          status: true,
          register: `${user.email} registered successfully.`,
          data: {
            user: user.toJSON(),
            token: accessToken,
          },
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  };