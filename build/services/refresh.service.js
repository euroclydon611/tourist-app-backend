"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessTokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncErrors_1 = __importDefault(require("../middleware/catchAsyncErrors"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
exports.refreshAccessTokenMiddleware = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        const { access_token } = req.cookies;
        if (access_token) {
            const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
            req.user = decoded;
        }
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
    next();
});
//# sourceMappingURL=refresh.service.js.map