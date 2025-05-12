import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import HiddenGemModel from "../models/hiddengems.model";

/**
 * @desc    Create a new destination
 * @route   POST /api/destinations
 * @access  Protected/Admin
 */
export const createHiddengem = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {
      name,
      region,
      description,
      shortDescription,
      rating,
      coordinates,
      // topAttractions,
      // tags,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !region ||
      !description ||
      !shortDescription ||
      !rating ||
      !coordinates
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
      await HiddenGemModel.create({
        name,
        region,
        description,
        shortDescription,
        rating,
        coordinates: JSON.parse(coordinates),
        // topAttractions: JSON.parse(topAttractions),
        // tags: JSON.parse(tags),
        imageUrl,
      });

      res.status(201).json({
        success: true,
        message: "Destination created successfully.",
      });
    } catch (error: any) {
      console.error("Failed to create destination:", error);
      return next(new ErrorHandler("Failed to create destination.", 500));
    }
  }
);

/**
 * @desc    Update an existing destination
 * @route   PUT /api/destinations/:id
 * @access  Protected/Admin
 */
export const updateHiddengem = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const destinationId = req.params.id;

    const {
      name,
      region,
      description,
      shortDescription,
      rating,
      coordinates,
      // topAttractions,
      // tags,
    } = req.body;

    try {
      const destination = await HiddenGemModel.findById(destinationId);

      if (!destination) {
        return next(new ErrorHandler("Destination not found.", 404));
      }

      // Update image if a new file was uploaded
      if (req.file) {
        destination.imageUrl = req.file.filename;
      }

      // Update other fields
      destination.name = name ?? destination.name;
      destination.region = region ?? destination.region;
      destination.description = description ?? destination.description;
      destination.shortDescription =
        shortDescription ?? destination.shortDescription;
      destination.rating = rating ?? destination.rating;
      destination.coordinates = coordinates
        ? JSON.parse(coordinates)
        : destination.coordinates;
      // destination.topAttractions = topAttractions
      //   ? JSON.parse(topAttractions)
      //   : destination.topAttractions;
      // destination.tags = tags ? JSON.parse(tags) : destination.tags;

      await destination.save();

      res.status(200).json({
        success: true,
        message: "Destination updated successfully.",
        data: destination,
      });
    } catch (error: any) {
      console.error("Failed to update destination:", error);
      return next(new ErrorHandler("Failed to update destination.", 500));
    }
  }
);

export const fetchHiddengems = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { page = 1, limit = 10, search = "", lat, lng } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build base query with optional text filters
    const query: any = {
      $or: [
        { name: new RegExp(search as string, "i") },
        { region: new RegExp(search as string, "i") },
        { tags: { $in: [new RegExp(search as string, "i")] } },
      ],
    };

    // If lat/lng provided, sort by proximity
    const geoOptions: any[] =
      lat && lng
        ? [
            {
              $geoNear: {
                near: {
                  type: "Point",
                  coordinates: [
                    parseFloat(lng as string),
                    parseFloat(lat as string),
                  ],
                },
                distanceField: "distance",
                spherical: true,
                query,
              },
            },
          ]
        : [{ $match: query }];

    try {
      const destinations = await HiddenGemModel.aggregate([
        ...geoOptions,
        { $skip: skip },
        { $limit: limitNum },
      ]);

      const total = await HiddenGemModel.countDocuments(query);

      res.status(200).json({
        success: true,
        data: destinations,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err: any) {
      console.error("Error fetching destinations:", err);
      return next(new ErrorHandler("Unable to fetch destinations", 500));
    }
  }
);

// GET /api/destinations/:id
export const getHiddengemById = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const destination = await HiddenGemModel.findById(id);

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
export const hiddengemReview = catchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, rating, comment, destinationId } = req.body;

      console.log("req.body", req.body);

      const destination = await HiddenGemModel.findById(destinationId);

      if (!destination) {
        return next(new ErrorHandler("No destination found", 400));
      }

      console.log("destination::", destination);

      const review: any = {
        user,
        rating,
        comment,
        destinationId,
      };

      console.log("review", review);

      const isReviewed = destination?.reviews?.find(
        (rev: any) => rev.user._id === req.user?._id
      );

      if (isReviewed) {
        destination?.reviews.forEach((rev: any) => {
          if (rev?.user._id === req.user?._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        destination?.reviews.push(review);
        console.log("====", review);
      }

      let avg = 0;

      destination?.reviews.forEach((rev) => {
        avg += rev.rating;
        console.log("avg", avg);
      });

      if (destination) {
        destination.rating = (avg / destination.reviews.length).toString();
      }

      console.log("experience ratings", avg / destination.reviews.length);

      console.log("started");

      await destination?.save({ validateBeforeSave: false });
      console.log("ended");

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
