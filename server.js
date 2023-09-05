const Express = require("express");
const app = Express();
const cors = require("cors");
const morgan = require("morgan");
const { Sequelize } = require("sequelize");
const bodyParser = require("body-parser");

const { port } = require("./config");
const PORT = process.env.PORT || port;

//Express routes
const userAuthRoutes = require("./routes/users/index");
const searchAuthRoutes = require("./routes/search/index");
const uploadAuthRoutes = require("./routes/upload/index");

// user model
const userRepo = require("./database/repos/user.repo");
const sensorRepo = require("./database/repos/sensor.repo");

//middleware
app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use(Express.json());

//sequelize connection
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./storage/userData.db",
});

// Initialise the user model
userRepo.initialise(sequelize);
sensorRepo.initialise(sequelize);

// Sync the sequelize models
sequelize
  .sync()
  .then(() => {
    console.log("Sequelize initialised successfully.");

    // Express routes
    app.use("/", userAuthRoutes);
    app.use("/", searchAuthRoutes);
    app.use("/", uploadAuthRoutes);

    // Start the server..
    app.listen(PORT, () => {
      console.log("Server Listening on PORT:", PORT);
    });
  })
  .catch((err) => {
    console.error("Sequelize initialisation threw an error:", err);
  });
