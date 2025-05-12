import express from "express";
import { createBooking, fetchBookings } from "../controller/booking.controller";
const router = express.Router();


router.post("/create-booking", createBooking);

router.get("/get-bookings", fetchBookings);

router.get("/booking/:id", fetchBookings);

router.put("/booking/review", fetchBookings);

export default router;
