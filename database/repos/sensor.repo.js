const SensorModel = require("../models/Sensor");
const sequelize = require("sequelize");
const Op = sequelize.Op;

module.exports = {
  initialise: (sequelize) => {
    this.model = sequelize.define("sensor", SensorModel);
  },

  bulkCreate: (sensors) => {
    return this.model.bulkCreate(sensors);
  },

  createSensor: (sensor) => {
    return this.model.create(sensor);
  },
  findSensor: (query) => {
    return this.model.findOne({
      where: query,
    });
  },
  findAllSensors: () => {
    return this.model.findAll();
  },

  /**
   *
   * @param {*} searchOptions
   *
   * make a function that takes in a query and search options like filters, sort, aggregate
   *  and returns the result of the query
   * use the sequelize.fn function to apply the filters, sort, aggregate
   * @returns
   */
  queryAllSensors: async (searchOptions) => {
    let query = {};

    let moreThanLessThanRange = "";
    let ascendingOrDescending = "";
    let filterKey = "";
    let filterAmount = "";
    let aggregateOperator = "";
    let aggregateColumn = "";
    let sortColumn = "";

    if (searchOptions.filters) {
      //object to array to get the key and value for the current filterOption
      Object.keys(searchOptions.filters).forEach(function (key) {
        filterKey = key;
        var newkey = "filterOption";
        searchOptions.filters[newkey] = searchOptions.filters[key];
        //delete searchOptions.filters[key];
      });

      //object to array to get the filterAmount
      Object.keys(searchOptions.filters.filterOption).forEach(function (key) {
        filterAmount = searchOptions.filters.filterOption[key];
      });

      //get correct range value
      moreThanLessThanRange = searchOptions.filters.filterOption.hasOwnProperty(
        "gte"
      )
        ? Op.gte
        : (moreThanLessThanRange =
            searchOptions.filters.filterOption.hasOwnProperty("lte")
              ? Op.lte
              : Op.eq);
    }

    if (searchOptions.sort) {
      ascendingOrDescending =
        searchOptions.sort.order === "descending" ? "DESC" : "ASC";
      sortColumn = searchOptions.sort.column;
    }

    if (searchOptions.aggregate) {
      aggregateOperator = searchOptions.aggregate.operator;
      aggregateColumn = searchOptions.aggregate.column;
    }
    //calculate query using sequelize
    if (searchOptions.filters && searchOptions.sort && searchOptions.aggregate) {
      query = {
        attributes: [
          [
            sequelize.fn(aggregateOperator, sequelize.col(aggregateColumn)),
            aggregateColumn,
          ],
        ],
        order: [[sequelize.col(sortColumn), ascendingOrDescending]],
        where: {
          [filterKey]: {
            [moreThanLessThanRange]: filterAmount,
          },
        },
      };
    } else if (searchOptions.filters && searchOptions.sort) {
      query = {
        order: [[sequelize.col(sortColumn), ascendingOrDescending]],
        where: {
          [filterKey]: {
            [moreThanLessThanRange]: filterAmount,
          },
        },
      };
    } else if (searchOptions.filters && searchOptions.aggregate) {
      query = {
        attributes: [
          [
            sequelize.fn(aggregateOperator, sequelize.col(aggregateColumn)),
            aggregateColumn,
          ],
        ],
        where: {
          [filterKey]: {
            [moreThanLessThanRange]: filterAmount,
          },
        },
      };
    } else if (searchOptions.sort && searchOptions.aggregate) {
      query = {
        attributes: [
          [
            sequelize.fn(aggregateOperator, sequelize.col(aggregateColumn)),
            aggregateColumn,
          ],
        ],
        order: [[sequelize.col(sortColumn), ascendingOrDescending]],
      };
    } else if (searchOptions.filters) {
      query = {
        where: {
          [filterKey]: {
            [moreThanLessThanRange]: filterAmount,
          },
        },
      };
    } else if (searchOptions.sort) {
      query = {
        order: [[sequelize.col(sortColumn), ascendingOrDescending]],
      };
    } else if (searchOptions.aggregate) {
      query = {
        attributes: [
          [
            sequelize.fn(aggregateOperator, sequelize.col(aggregateColumn)),
            aggregateColumn,
          ],
        ],
      };
    }

    console.log(query);
    return await this.model.findAll(query);
  },

  deleteSensor: (query) => {
    return this.model.destroy({
      where: query,
    });
  },
};
