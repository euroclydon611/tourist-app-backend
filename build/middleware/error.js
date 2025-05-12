"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const http_status_codes_1 = require("http-status-codes");
const ErrorHandlerMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    err.message = err.message || "Internal server error";
    // Log the error for later analysis
    console.error(err);
    // Wrong MongoDB ID error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler_1.default(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    // Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate entry for ${Object.keys(err.keyValue)}`;
        err = new ErrorHandler_1.default(message, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    // Wrong JWT error
    if (err.name === "JsonWebTokenError") {
        const message = "Invalid JSON web token. Please try again.";
        err = new ErrorHandler_1.default(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    // JWT expired error
    if (err.name === "TokenExpiredError") {
        const message = "JSON web token has expired. Please log in again.";
        err = new ErrorHandler_1.default(message, http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    // Send a more user-friendly message to clients
    res.status(err.statusCode).json({
        success: false,
        status: err.statusCode,
        message: err.message,
    });
};
exports.default = ErrorHandlerMiddleware;
//# sourceMappingURL=error.js.map