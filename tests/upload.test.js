//testing upload functionality
const { createMocks } = require("node-mocks-http");
const { uploadProcess } = require("../routes/upload/uploadProcess/uploader");
const { uploadService } = require("../services/uploadService.service");
const fs = require("fs");
const { validateFile } = require("../services/uploadService.service");
const SensorRepo = require("../database/repos/sensor.repo");

jest.mock("../services/uploadService.service", () => ({
  uploadService: jest.fn(),
  validateFile: jest.fn(),
}));

const uploadData = [
  {
    timestamp: "1690967790",
    temperature: "14.1",
    rainfall: "6.11",
    humidity: "20",
    wind_speed: "23",
    visibility: "M",
  },
  {
    timestamp: "1690999756",
    temperature: "16.2",
    rainfall: "4.23",
    humidity: "30",
    wind_speed: "12",
    visibility: "M",
  },
  {
    timestamp: "1691012723",
    temperature: "15.7",
    rainfall: "3.56",
    humidity: "20",
    wind_speed: "11",
    visibility: "G",
  },
  {
    timestamp: "1691032353",
    temperature: "17.6",
    rainfall: "2.19",
    humidity: "40",
    wind_speed: "18",
    visibility: "VG",
  },
  {
    timestamp: "1691054751",
    temperature: "19.5",
    rainfall: "1.2",
    humidity: "50",
    wind_speed: "7",
    visibility: "E",
  },
];

describe("/api/sensors/upload", () => {
  beforeEach(() => {
    jest
      .spyOn(uploadService, "call")
      .mockImplementation(() => Promise.resolve(data));
  });
  afterEach(() => {
    jest.resetAllMocks();
    uploadService.call.mockRestore();
  });

  // 200 - File is uploaded successfully
  it("should be able to upload data", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "admin@admin.com",
        password: "password",
      },
      file: {
        filename: "sensorsData.csv",
        originalname: "sensorsData.csv",
        destination: "./storage/csv/",
        path: "./storage/csv/sensorsData.csv",
        mimetype: "text/csv",
      },
      originalUrl: "/api/sensors/upload",
    });

    const csvOutput = {
      success: true,
      message: `sensorsData.csv uploaded successfully.`,
    };

    // Mock fs.createReadStream
    jest.spyOn(fs, "createReadStream").mockReturnValueOnce({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "open") {
          callback();
        } else if (event === "data") {
          callback();
        } else if (event === "finish") {
          callback();
        } else if (event === "end") {
          callback();
        }
      }),
    });

    // Mock validateFile function
    jest.spyOn({ validateFile }, "validateFile").mockResolvedValueOnce(uploadData);

    // Mock SensorRepo.bulkCreate function
    jest.spyOn(SensorRepo, "bulkCreate").mockImplementationOnce(() => {});
    
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    jest.spyOn(uploadService, 'call').mockResolvedValue(csvOutput)

    // Call the uploadService function
    uploadService.mockResolvedValue(csvOutput);

    // Call the uploadService function
    await uploadProcess(req, res);

    expect(res.send()._getStatusCode()).toEqual(200);
    expect(res.send()._getData()).toEqual({
      status: true,
      message: "sensorsData.csv uploaded successfully.",
    });
  });

  //400 - File does not upload sucessfully
    it("should handle valid email, valid password, and invalid CSV file", async () => {
    // Mock request object
    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "admin@admin.com",
        password: "password",
      },
      file: undefined,
      originalUrl: "/api/sensors/upload",
    });

    const csvOutput = {
      success: false,
      message: `Error - File not found.`,
    };

    // Mock fs.createReadStream
    jest.spyOn(fs, "createReadStream").mockReturnValueOnce({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "open") {
          callback();
        } else if (event === "data") {
          callback();
        } else if (event === "finish") {
          callback();
        } else if (event === "end") {
          callback();
        }
      }),
    });

    // Mock validateFile function
    jest.spyOn({ validateFile }, "validateFile").mockResolvedValueOnce(null);

    // Mock SensorRepo.bulkCreate function
    jest.spyOn(SensorRepo, "bulkCreate").mockImplementationOnce(() => {});
    
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    jest.spyOn(uploadService, 'call').mockResolvedValue(csvOutput)

    // Call the uploadService function
    uploadService.mockResolvedValue(csvOutput);

    // Call the uploadService function
    await uploadProcess(req, res);

    expect(res.send()._getStatusCode()).toEqual(400);
    expect(res.send()._getData()).toEqual({
      status: false,
      error: {
          "message": "CSV file not found or not csv file type. Invalid"
      }
    });
  });
});
