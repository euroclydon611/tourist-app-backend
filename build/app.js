"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv").config();
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_1 = __importDefault(require("./middleware/error"));
const ErrorHandler_1 = __importDefault(require("./utils/ErrorHandler"));
const path_1 = __importDefault(require("path"));
const refresh_service_1 = require("./services/refresh.service");
exports.app.use(express_1.default.json({ limit: "50mb" }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use("/", express_1.default.static(path_1.default.join(__dirname, "./uploads")));
exports.app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://147.182.237.161:5173",
        "http://localhost:9098",
        "http://localhost:9097",
    ],
    credentials: true,
}));
//routers
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const destinations_routes_1 = __importDefault(require("./routes/destinations.routes"));
const experiences_routes_1 = __importDefault(require("./routes/experiences.routes"));
const hiddengems_routes_1 = __importDefault(require("./routes/hiddengems.routes"));
const bookings_routes_1 = __importDefault(require("./routes/bookings.routes"));
//testing api
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({ success: true, message: "api is working" });
});
//refresh user access token
exports.app.use(refresh_service_1.refreshAccessTokenMiddleware);
//routes
exports.app.use("/api/v1", user_routes_1.default, destinations_routes_1.default, experiences_routes_1.default, hiddengems_routes_1.default, bookings_routes_1.default);
//unknown routes
exports.app.all("*", (req, res, next) => {
    const err = new ErrorHandler_1.default(`Route ${req.originalUrl} not found`, 400);
    next(err);
});
exports.app.use(error_1.default);
//# sourceMappingURL=app.js.map