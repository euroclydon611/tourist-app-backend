import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ExperienceModel from "../models/experiences.model";

/**
 * @desc    Create a new experience
 * @route   POST /api/experiences
 * @access  Protected/Admin
 */
export const createExperience = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { title, category, description, location, price, duration } =
      req.body;

    // Basic validation
    if (
      !title ||
      !category ||
      !description ||
      !location ||
      !price ||
      !duration
    ) {
      return next(
        new ErrorHandler("All required fields must be provided.", 400)
      );
    }

    // Ensure image was uploaded
    if (!req.file) {
      return next(new ErrorHandler("Destination image is required.", 400));
    }

    // Construct full image path (served statically)
    const imageUrl = `${req.file.filename}`;

    // Create destination entry
    try {
      await ExperienceModel.create({
        title,
        category,
        description,
        location,
        price,
        duration,
        imageUrl,
      });

      res.status(201).json({
        success: true,
        message: "Experience created successfully.",
      });
    } catch (error: any) {
      console.error("Failed to create experience:", error);
      return next(new ErrorHandler("Failed to create experience.", 500));
    }
  }
);

/**
 * @desc    Update an existing experience
 * @route   PUT /api/experiences/:id
 * @access  Protected/Admin
 */
export const updateExperience = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { title, category, description, location, price, duration } =
      req.body;

    // Find the experience by ID
    const experience = await ExperienceModel.findById(id);

    if (!experience) {
      return next(new ErrorHandler("Experience not found.", 404));
    }

    // Update fields if provided
    if (title) experience.title = title;
    if (category) experience.category = category;
    if (description) experience.description = description;
    if (location) experience.location = location;
    if (price) experience.price = price;
    if (duration) experience.duration = duration;

    // Replace image if new one is uploaded
    if (req.file) {
      experience.imageUrl = req.file.filename;
    }

    try {
      await experience.save();

      res.status(200).json({
        success: true,
        message: "Experience updated successfully.",
        data: experience,
      });
    } catch (error: any) {
      console.error("Failed to update experience:", error);
      return next(new ErrorHandler("Failed to update experience.", 500));
    }
  }
);

export const fetchExperiences = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Optional search query
    const query: any =
      search !== ""
        ? {
            $or: [
              { title: new RegExp(search as string, "i") },
              { category: new RegExp(search as string, "i") },
              { location: new RegExp(search as string, "i") },
              { tags: { $in: [new RegExp(search as string, "i")] } },
            ],
          }
        : {};

    try {
      const experiences = await ExperienceModel.find(query)
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 });

      const total = await ExperienceModel.countDocuments(query);

      res.status(200).json({
        success: true,
        data: experiences,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err: any) {
      console.error("Error fetching experiences:", err);
      return next(new ErrorHandler("Unable to fetch experiences", 500));
    }
  }
);

// GET /api/destinations/:id
export const getExperienceById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const destination = await ExperienceModel.findById(id);

    if (!destination) {
      return next(new ErrorHandler("Destination not found", 404));
    }

    res.status(200).json({
      success: true,
      data: destination,
    });
  }
);

// review for a destination
export const experiencReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, rating, comment, experienceId } = req.body;

      const experience = await ExperienceModel.findById(experienceId);

      if (!experience) {
        return next(new ErrorHandler("No experience found", 400));
      }

      const review: any = {
        user,
        rating,
        comment,
        experienceId,
      };

      const isReviewed = experience?.reviews?.find(
        (rev: any) => rev.user._id === req.user?._id
      );

      if (isReviewed) {
        experience?.reviews.forEach((rev: any) => {
          if (rev?.user._id === req.user?._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        experience?.reviews?.push(review);
      }

      let avg = 0;

      experience?.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      if (experience) {
        experience.rating = (avg / experience.reviews.length).toString();
      }

      console.log("experience ratings", avg / experience.reviews.length);

      await experience?.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
