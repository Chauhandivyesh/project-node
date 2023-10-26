// status-codes.js
const statusCode = {
  OK: {
    statuscode: 200,
    message: "The request was successful.",
    type : "success",
    code : "1",
  },
  CREATED: {
    statuscode: 201,
    message: "Resource created successfully.",
    type : "success",
    code : "1",
  },
  BAD_REQUEST: {
    statuscode: 400,
    message: "Bad request. Please check your input data.",
    type : "failed",
    code : "0",
  },
  ALREADY_EXISTS: {
    statuscode: 406,
    message: "Data already exists",
    type : "failed",
    code : "0",
  },
  NOT_FOUND: {
    statuscode: 404,
    message: "The requested resource was not found.",
    type : "failed",
    code : "0",
  },
  INTERNAL_SERVER_ERROR: {
    statuscode: 500,
    message: "Internal server error. Please try again later.",
    type : "failed",
    code : "0",
  },
  SYSTEM_ERROR: {
    statuscode: 490,
    message: "System error. Please try again later.",
    type : "failed",
    code : "0",
  }
  // Add more status codes and messages as needed.
};

module.exports = statusCode;