//testing search functionality
const { searchProcess }    = require("../routes/search/searchProcess/search");
const { searchAllProcess } = require("../routes/search/searchProcess/searchAll");
const { searchService }    = require("../services/searchService.service");
const { searchAllService } = require("../services/searchAllService.service");
const { createMocks } = require("node-mocks-http");

jest.mock("../services/searchAllService.service", () => ({
  searchAllService: jest.fn(),
}));

jest.mock("../services/searchService.service", () => ({
  searchService: jest.fn(),
}));

const sensorDataTest1 = [
  {
      "id": 3,
      "timestamp": "1690999756",
      "temperature": 16.2,
      "rainfall": 4.23,
      "humidity": 30,
      "wind_speed": 12,
      "visibility": "M",
      "createdAt": "2023-08-20 15:52:29.564 +00:00",
      "updatedAt": "2023-08-20 15:52:29.564 +00:00"
  },
  {
      "id": 5,
      "timestamp": "1691032353",
      "temperature": 17.6,
      "rainfall": 2.19,
      "humidity": 40,
      "wind_speed": 18,
      "visibility": "VG",
      "createdAt": "2023-08-20 15:52:29.565 +00:00",
      "updatedAt": "2023-08-20 15:52:29.565 +00:00"
  },
  {
      "id": 6,
      "timestamp": "1691054751",
      "temperature": 19.5,
      "rainfall": 1.2,
      "humidity": 50,
      "wind_speed": 7,
      "visibility": "E",
      "createdAt": "2023-08-20 15:52:29.565 +00:00",
      "updatedAt": "2023-08-20 15:52:29.565 +00:00"
  }
]

const sensorDataTest2 = [
  {
      "id": 3,
      "timestamp": "1690999756",
      "temperature": 16.2,
      "rainfall": 4.23,
      "humidity": 30,
      "wind_speed": 12,
      "visibility": "M",
      "createdAt": "2023-08-20 15:52:29.564 +00:00",
      "updatedAt": "2023-08-20 15:52:29.564 +00:00"
  }
]

const sensorDataTest3 = [
  {
      "humidity": 163
  }
]

const sensorDataTest4 = [
      {
          "id": 1,
          "timestamp": "1690967790",
          "temperature": 1,
          "rainfall": 2,
          "humidity": 3,
          "wind_speed": 4,
          "visibility": "lots",
          "createdAt": "2023-08-20 15:52:29.564 +00:00",
          "updatedAt": "2023-08-20 15:52:29.564 +00:00"
      },
      {
          "id": 2,
          "timestamp": "1690967790",
          "temperature": 14.1,
          "rainfall": 6.11,
          "humidity": 20,
          "wind_speed": 23,
          "visibility": "M",
          "createdAt": "2023-08-20 15:52:29.564 +00:00",
          "updatedAt": "2023-08-20 15:52:29.564 +00:00"
      },
      {
          "id": 4,
          "timestamp": "1691012723",
          "temperature": 15.7,
          "rainfall": 3.56,
          "humidity": 20,
          "wind_speed": 11,
          "visibility": "G",
          "createdAt": "2023-08-20 15:52:29.564 +00:00",
          "updatedAt": "2023-08-20 15:52:29.564 +00:00"
      },
      {
          "id": 3,
          "timestamp": "1690999756",
          "temperature": 16.2,
          "rainfall": 4.23,
          "humidity": 30,
          "wind_speed": 12,
          "visibility": "M",
          "createdAt": "2023-08-20 15:52:29.564 +00:00",
          "updatedAt": "2023-08-20 15:52:29.564 +00:00"
      },
      {
          "id": 5,
          "timestamp": "1691032353",
          "temperature": 17.6,
          "rainfall": 2.19,
          "humidity": 40,
          "wind_speed": 18,
          "visibility": "VG",
          "createdAt": "2023-08-20 15:52:29.565 +00:00",
          "updatedAt": "2023-08-20 15:52:29.565 +00:00"
      },
      {
          "id": 6,
          "timestamp": "1691054751",
          "temperature": 19.5,
          "rainfall": 1.2,
          "humidity": 50,
          "wind_speed": 7,
          "visibility": "E",
          "createdAt": "2023-08-20 15:52:29.565 +00:00",
          "updatedAt": "2023-08-20 15:52:29.565 +00:00"
      }
  ]

// ----------------------------
// ----------------------------
// searchAll tests
// ----------------------------
// ----------------------------

describe("/api/sensors/searchAll", () => {
  beforeEach(() => {
    jest
      .spyOn(searchAllService, "call")
      .mockImplementation(() => Promise.resolve(data));
  });
  afterEach(() => {
    jest.resetAllMocks();
    searchAllService.call.mockRestore();
  });
  
  // 200 - Tests that the function returns a 200 status and returns all sensor data
  it("should be able to search all data", async () => {
    const { req, res } = createMocks({
      method: "POST",
      originalUrl: "/api/sensors/searchAll",
    });

    // Mock searchAllService to return sensor data
    const mockSensorData = { status: true, data: "data" };
    jest.spyOn(searchAllService, 'mockResolvedValue').mockResolvedValue(mockSensorData);

    
    searchAllService.mockResolvedValueOnce(mockSensorData);
    await searchAllProcess(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toBe("OK");
    expect(res.send()._getData()).toBe(mockSensorData);
  });

  // 400 - Tests that the function returns a 400 status and an error message when a user with the provided email is not found
  it("should not be able to search all data", async () => {
    const { req, res } = createMocks({
      method: "POST",
      originalUrl: "/api/sensors/searchAll",
    });

    const mockSensorDataInvalid = {
      success: false,
      error: {
        message: "Could not retrieve sensor data.",
      },
    };

    jest.spyOn(searchAllService, 'mockResolvedValue').mockResolvedValue(mockSensorDataInvalid);

    searchAllService.mockResolvedValueOnce(mockSensorDataInvalid);
    await searchAllProcess(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res.statusCode).toBe(400);
    expect(res.send()._getData()).toEqual({
      status: false,
      error: {
        message: "Could not retrieve sensor data."
      },
    });
  }
  );
});

// ----------------------------
// ----------------------------
// search filter/sort/aggregation tests
// ----------------------------
// ----------------------------


describe("/api/sensors/search", () => {

  // 200 - Tests that the function returns a 200 status and filters some data
  it("should be able to filter some data", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        filters: {
          humidity: { gte: 30 },
        },
      },
      originalUrl: "/api/sensors/search",
    });

    const mockSensorData = {
      success: true, data: sensorDataTest1
    };
    const resultData = {
        status: true,
        data: sensorDataTest1
    };

    searchService.mockResolvedValueOnce(mockSensorData);
    await searchProcess(req, res);

    expect(res.send()._getStatusCode()).toBe(200);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toBe("OK");
    expect(res.send()._getData()).toEqual(resultData);
  });

  // 200 - Tests that the function returns a 200 status and filters some data
  it("should be able to check equality", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        filters: {
          humidity: { eq: 30 },
          rainfall: { eq: 4.23 },
        },
      },
      originalUrl: "/api/sensors/search",
    });

    const mockSensorData = {
      success: true, data: sensorDataTest2
    };
    const resultData = {
        status: true,
        data: sensorDataTest2
    };

    searchService.mockResolvedValueOnce(mockSensorData);

    await searchProcess(req, res);

    expect(res.send()._getStatusCode()).toBe(200);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toBe("OK");
    expect(res.send()._getData()).toEqual(resultData);
  });

  //200 - Tests that the function returns a 200 status and aggregating some data
  it("should be able to aggregate some results", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        aggregate: {
          column: "humidity",
          operator: "SUM",
        },
      },
      originalUrl: "/api/sensors/search",
    });

    const mockSensorData = {
      success: true, data: sensorDataTest3
    };

    const resultData = {
        status: true,
        data: sensorDataTest3
    };

    searchService.mockResolvedValueOnce(mockSensorData);

    await searchProcess(req, res);

    expect(res.send()._getStatusCode()).toBe(200);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toBe("OK");
    expect(res.send()._getData()).toEqual(resultData);
  });

  // 200 - Tests that the function returns a 200 status and aggregating data
  it("should be able to sort", async () => {
    const { req, res } = createMocks({
    method: "POST",
    body: {
      sort: {
        column: "temperature",
        order: "ascending",
      },
    },
    originalUrl: "/api/sensors/search",
  });

  const mockSensorData = {
    success: true, data: sensorDataTest4
  };

  const resultData = {
      status: true,
      data: sensorDataTest4
  };

  searchService.mockResolvedValueOnce(mockSensorData);

  await searchProcess(req, res);

  expect(res.send()._getStatusCode()).toBe(200);
  expect(res.statusCode).toBe(200);
  expect(res.statusMessage).toBe("OK");
  expect(res.send()._getData()).toEqual(resultData);
  });


  // 400 - Tests that the function returns a 400 status and an error message when filter fields are not present
  it("should not be able to filter some data", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        sort: {
          column: "",
          order: ""
        }
      },
      originalUrl: "/api/sensors/search",
    });

    const mockSensorDataInvalid = {
      success: false,
      error: {
        message: "Could not retrieve sensor data.",
      },
    };

    searchService.mockResolvedValueOnce(mockSensorDataInvalid);
    await searchProcess(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res.send()._getData()).toEqual({
      status: false,
      error: {
        message: "Could not retrieve sensor data."
      }
    });
  });

});