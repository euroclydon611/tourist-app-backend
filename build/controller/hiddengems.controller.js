"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hiddengemReview = exports.getHiddengemById = exports.fetchHiddengems = exports.updateHiddengem = exports.createHiddengem = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = __importDefault(require("../middleware/catchAsyncErrors"));
const hiddengems_model_1 = __importDefault(require("../models/hiddengems.model"));
/**
 * @desc    Create a new destination
 * @route   POST /api/destinations
 * @access  Protected/Admin
 */
exports.createHiddengem = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    const { name, region, description, shortDescription, rating, coordinates,
    // topAttractions,
    // tags,
     } = req.body;
    // Basic validation
    if (!name ||
        !region ||
        !description ||
        !shortDescription ||
        !rating ||
        !coordinates) {
        return next(new ErrorHandler_1.default("All required fields must be provided.", 400));
    }
    // Ensure image was uploaded
    if (!req.file) {
        return next(new ErrorHandler_1.default("Destination image is required.", 400));
    }
    // Construct full image path (served statically)
    const imageUrl = `${req.file.filename}`;
    // Create destination entry
    try {
        await hiddengems_model_1.default.create({
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
    }
    catch (error) {
        console.error("Failed to create destination:", error);
        return next(new ErrorHandler_1.default("Failed to create destination.", 500));
    }
});
/**
 * @desc    Update an existing destination
 * @route   PUT /api/destinations/:id
 * @access  Protected/Admin
 */
exports.updateHiddengem = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    const destinationId = req.params.id;
    const { name, region, description, shortDescription, rating, coordinates,
    // topAttractions,
    // tags,
     } = req.body;
    try {
        const destination = await hiddengems_model_1.default.findById(destinationId);
        if (!destination) {
            return next(new ErrorHandler_1.default("Destination not found.", 404));
        }
        // Update image if a new file was uploaded
        if (req.file) {
            destination.imageUrl = req.file.filename;
        }
        // Update other fields
        destination.name = name !== null && name !== void 0 ? name : destination.name;
        destination.region = region !== null && region !== void 0 ? region : destination.region;
        destination.description = description !== null && description !== void 0 ? description : destination.description;
        destination.shortDescription =
            shortDescription !== null && shortDescription !== void 0 ? shortDescription : destination.shortDescription;
        destination.rating = rating !== null && rating !== void 0 ? rating : destination.rating;
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
    }
    catch (error) {
        console.error("Failed to update destination:", error);
        return next(new ErrorHandler_1.default("Failed to update destination.", 500));
    }
});
exports.fetchHiddengems = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    const { page = 1, limit = 10, search = "", lat, lng } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Build base query with optional text filters
    const query = {
        $or: [
            { name: new RegExp(search, "i") },
            { region: new RegExp(search, "i") },
            { tags: { $in: [new RegExp(search, "i")] } },
        ],
    };
    // If lat/lng provided, sort by proximity
    const geoOptions = lat && lng
        ? [
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [
                            parseFloat(lng),
                            parseFloat(lat),
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
        const destinations = await hiddengems_model_1.default.aggregate([
            ...geoOptions,
            { $skip: skip },
            { $limit: limitNum },
        ]);
        const total = await hiddengems_model_1.default.countDocuments(query);
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
    }
    catch (err) {
        console.error("Error fetching destinations:", err);
        return next(new ErrorHandler_1.default("Unable to fetch destinations", 500));
    }
});
// GET /api/destinations/:id
exports.getHiddengemById = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const destination = await hiddengems_model_1.default.findById(id);
    if (!destination) {
        return next(new ErrorHandler_1.default("Destination not found", 404));
    }
    res.status(200).json({
        success: true,
        data: destination,
    });
});
// review for a destination
exports.hiddengemReview = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    var _a;
    try {
        const { user, rating, comment, destinationId } = req.body;
        console.log("req.body", req.body);
        const destination = await hiddengems_model_1.default.findById(destinationId);
        if (!destination) {
            return next(new ErrorHandler_1.default("No destination found", 400));
        }
        console.log("destination::", destination);
        const review = {
            user,
            rating,
            comment,
            destinationId,
        };
        console.log("review", review);
        const isReviewed = (_a = destination === null || destination === void 0 ? void 0 : destination.reviews) === null || _a === void 0 ? void 0 : _a.find((rev) => { var _a; return rev.user._id === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id); });
        if (isReviewed) {
            destination === null || destination === void 0 ? void 0 : destination.reviews.forEach((rev) => {
                var _a;
                if ((rev === null || rev === void 0 ? void 0 : rev.user._id) === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
                    (rev.rating = rating), (rev.comment = comment), (rev.user = user);
                }
            });
        }
        else {
            destination === null || destination === void 0 ? void 0 : destination.reviews.push(review);
            console.log("====", review);
        }
        let avg = 0;
        destination === null || destination === void 0 ? void 0 : destination.reviews.forEach((rev) => {
            avg += rev.rating;
            console.log("avg", avg);
        });
        if (destination) {
            destination.rating = (avg / destination.reviews.length).toString();
        }
        console.log("experience ratings", avg / destination.reviews.length);
        console.log("started");
        await (destination === null || destination === void 0 ? void 0 : destination.save({ validateBeforeSave: false }));
        console.log("ended");
        res.status(200).json({
            success: true,
            message: "Reviwed succesfully!",
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//# sourceMappingURL=hiddengems.controller.js.map