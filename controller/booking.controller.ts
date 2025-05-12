import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import BookingModel from "../models/booking.model";
import mongoose from "mongoose";

export const createBooking = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    console.log("userId", userId);
    const {
      destinationId,
      experienceId,
      hiddenGemId,
      date,
      totalPrice,
      guests,
      notes,
    } = req.body;

    // Validate required fields
    if (!totalPrice || !guests || !date) {
      return next(
        new ErrorHandler("All required fields must be provided.", 400)
      );
    }

    try {
      const newBooking = await BookingModel.create({
        userId: userId,
        destinationId: destinationId || null,
        experienceId: experienceId || null,
        hiddenGemId: hiddenGemId || null,
        date,
        totalPrice,
        guests,
        notes,
      });

      res.status(201).json({
        success: true,
        message: "Booking created successfully.",
        data: newBooking,
      });
    } catch (error: any) {
      console.error("Failed to create booking:", error);
      return next(new ErrorHandler("Failed to create booking.", 500));
    }
  }
);

// export const fetchBookings = catchAsyncErrors(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // Parse pagination and search params
//     const {
//       page = "1",
//       limit = "10",
//       search = "",
//     } = req.query as Record<string, string>;
//     const pageNum = Math.max(1, parseInt(page, 10));
//     const limitNum = Math.max(1, parseInt(limit, 10));
//     const skip = (pageNum - 1) * limitNum;

//     // Get userId from authenticated user
//     const userId = req.query.userId;

//     // Build query with userId filter
//     const query: any = { userId };

//     // Add search filter if provided
//     if (search) {
//       query.notes = { $regex: new RegExp(search, "i") };
//     }

//     // Execute in parallel: find bookings & count total
//     const [bookings, total] = await Promise.all([
//       BookingModel.find(query)
//         // Populate related fields with just the path, let Mongoose use the ref defined in the schema
//         .populate({ path: "userId", select: "name email" })
//         .populate({ path: "destinationId", select: "name region" })
//         .populate({ path: "experienceId", select: "title" })
//         .populate({ path: "hiddenGemId", select: "name" })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limitNum),
//       BookingModel.countDocuments(query),
//     ]);

//     // Respond with data and pagination info
//     res.status(200).json({
//       success: true,
//       data: bookings,
//       pagination: {
//         total,
//         page: pageNum,
//         limit: limitNum,
//         totalPages: Math.ceil(total / limitNum),
//       },
//     });
//   }
// );

export const fetchBookings = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
      // Parse pagination and search params
      const {
        page = "1",
        limit = "10",
        search = "",
      } = req.query as Record<string, string>;
      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.max(1, parseInt(limit, 10));
      const skip = (pageNum - 1) * limitNum;
  
      // Get userId from authenticated user (or from query if provided)
      const userId = req.query.userId;
  
      // Build query, if userId is provided, filter by userId
      const query: any = {};
      if (userId) {
        query.userId = userId;
      }
  
      // Add search filter if provided
      if (search) {
        query.notes = { $regex: new RegExp(search, "i") };
      }
  
      // Execute in parallel: find bookings & count total
      const [bookings, total] = await Promise.all([
        BookingModel.find(query)
          // Populate related fields with just the path, let Mongoose use the ref defined in the schema
          .populate({ path: "userId", select: "name email" })
          .populate({ path: "destinationId", select: "name region" })
          .populate({ path: "experienceId", select: "title" })
          .populate({ path: "hiddenGemId", select: "name" })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum),
        BookingModel.countDocuments(query),
      ]);
  
      // Respond with data and pagination info
      res.status(200).json({
        success: true,
        data: bookings,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  );
  