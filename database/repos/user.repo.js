const UserModel = require("../models/User");

module.exports = {
    initialise: (sequelize) => {
      this.model = sequelize.define("user", UserModel);
    },
  
    bulkCreate(users) {
      return this.model.bulkCreate(users);
    },
  
    createUser: (user) => {
      return this.model.create(user);
    },
  
    findUser: async (query) => {
      return this.model.findOne({
        where: query,
      });
    }
  };