"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../controller/booking.controller");
const router = express_1.default.Router();
router.post("/create-booking", booking_controller_1.createBooking);
router.get("/get-bookings", booking_controller_1.fetchBookings);
router.get("/booking/:id", booking_controller_1.fetchBookings);
router.put("/booking/review", booking_controller_1.fetchBookings);
exports.default = router;
//# sourceMappingURL=bookings.routes.js.map