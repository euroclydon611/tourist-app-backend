"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncErrors_1 = __importDefault(require("./catchAsyncErrors"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
// authenticated user middleware
const isAuthenticated = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    const { access_token } = req.cookies;
    if (!access_token) {
        return next(new ErrorHandler_1.default("Session Timeout. Please login to continue", 400));
    }
    const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler_1.default("Access token is not valid", 400));
    }
    // You might fetch user data from your database here
    const user = await user_model_1.default.findById(decoded.id);
    if (!user) {
        return next(new ErrorHandler_1.default("User not found", 400));
    }
    // Assign the user to the request object
    req.user = user;
    next();
});
exports.isAuthenticated = isAuthenticated;
//validate user role
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a;
        if (!roles.includes(((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || "")) {
            return next(new ErrorHandler_1.default(`You do not have permission to access this resource.`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=auth.js.map