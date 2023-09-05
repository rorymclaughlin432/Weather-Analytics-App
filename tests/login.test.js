//testing login functionality
const { loginProcess } = require("../routes/users/login/login");
const { createMocks } = require("node-mocks-http");
const UserModel = require("../database/models/User");
const { loginService } = require("../services/loginService.service");

jest.mock("../services/loginService.service", () => ({
  loginService: jest.fn(),
}));

describe("/api/login", () => {
  beforeEach(() => {
    jest
      .spyOn(loginService, "call")
      .mockImplementation(() => Promise.resolve(data));
  });
  afterEach(() => {
    jest.resetAllMocks();
    loginService.call.mockRestore();
  });

  // 200 - Tests that the function returns a 200 status and a token when a user with the provided email and matching password is found
  it("should return a 200 status and a token when a user with the provided email and matching password is found", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "admin@admin.com",
        password: "password",
      },
      originalUrl: "/api/login",
    });

    const data = {
      success: true,
      token: "validtoken",
    };

    loginService.mockResolvedValue(data);

    await loginProcess(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res.statusCode).toBe(200);
    expect(res.statusMessage).toBe("OK");
  });

  // 400 - Tests that the function returns a 400 status and an error message when a user with the provided email is not found
  it("should not be able to login with invalid credentials", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "admin2@admin.com",
        password: "password",
      },
      originalUrl: "/api/login",
    });

    const data = {
      success: false,
      error: {
        message: "Could not find any user with email: `admin2@admin.com`.",
      },
    };

    UserModel.findUser = jest.fn().mockResolvedValue(null);

    loginService.mockResolvedValue(data);

    jest
      .spyOn(loginService, "call")
      .mockImplementation(() => Promise.resolve(data));

    await loginProcess(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res.statusCode).toBe(400);
    expect(res._getData()).toEqual(
      JSON.stringify({
        status: false,
        error: {
          message: "Could not find any user with email: `admin2@admin.com`.",
        },
      })
    );
  });

  // 400 - Tests that if the email is missing, status 400 is returned with an error message.
  it("should return status 400 with error message when email or password is missing", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "",
        password: "password",
      },
      originalUrl: "/api/login",
    });

    const data = {
      success: false,
      error: {
        message: "Email and password are required.",
      },
    };

    UserModel.findUser = jest.fn().mockResolvedValue(null);

    loginService.mockResolvedValue(data);

    jest
      .spyOn(loginService, "call")
      .mockImplementation(() => Promise.resolve(data));

    await loginProcess(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res.statusCode).toBe(400);
    expect(res._getData()).toEqual(
      JSON.stringify({
        status: false,
        error: {
          message: "Email and password are required.",
        },
      })
    );
  });

  // 400 - Tests that if the password is missing, status 400 is returned with an error message.
  it("should return status 400 with error message when password is missing", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "test@example.com",
        password: "",
      },
      originalUrl: "/api/login",
    });

    const data = {
      success: false,
      error: {
        message: "Email and password are required.",
      },
    };

    UserModel.findUser = jest.fn().mockResolvedValue(null);

    loginService.mockResolvedValue(data);

    jest
      .spyOn(loginService, "call")
      .mockImplementation(() => Promise.resolve(data));

    await loginProcess(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res.statusCode).toBe(400);
    expect(res._getData()).toEqual(
      JSON.stringify({
        status: false,
        error: {
          message: "Email and password are required.",
        },
      })
    );
  });
});
