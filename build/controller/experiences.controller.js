"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.experiencReview = exports.getExperienceById = exports.fetchExperiences = exports.updateExperience = exports.createExperience = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = __importDefault(require("../middleware/catchAsyncErrors"));
const experiences_model_1 = __importDefault(require("../models/experiences.model"));
/**
 * @desc    Create a new experience
 * @route   POST /api/experiences
 * @access  Protected/Admin
 */
exports.createExperience = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    const { title, category, description, location, price, duration } = req.body;
    // Basic validation
    if (!title ||
        !category ||
        !description ||
        !location ||
        !price ||
        !duration) {
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
        await experiences_model_1.default.create({
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
    }
    catch (error) {
        console.error("Failed to create experience:", error);
        return next(new ErrorHandler_1.default("Failed to create experience.", 500));
    }
});
/**
 * @desc    Update an existing experience
 * @route   PUT /api/experiences/:id
 * @access  Protected/Admin
 */
exports.updateExperience = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { title, category, description, location, price, duration } = req.body;
    // Find the experience by ID
    const experience = await experiences_model_1.default.findById(id);
    if (!experience) {
        return next(new ErrorHandler_1.default("Experience not found.", 404));
    }
    // Update fields if provided
    if (title)
        experience.title = title;
    if (category)
        experience.category = category;
    if (description)
        experience.description = description;
    if (location)
        experience.location = location;
    if (price)
        experience.price = price;
    if (duration)
        experience.duration = duration;
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
    }
    catch (error) {
        console.error("Failed to update experience:", error);
        return next(new ErrorHandler_1.default("Failed to update experience.", 500));
    }
});
exports.fetchExperiences = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    const { page = 1, limit = 10, search = "" } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    // Optional search query
    const query = search !== ""
        ? {
            $or: [
                { title: new RegExp(search, "i") },
                { category: new RegExp(search, "i") },
                { location: new RegExp(search, "i") },
                { tags: { $in: [new RegExp(search, "i")] } },
            ],
        }
        : {};
    try {
        const experiences = await experiences_model_1.default.find(query)
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });
        const total = await experiences_model_1.default.countDocuments(query);
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
    }
    catch (err) {
        console.error("Error fetching experiences:", err);
        return next(new ErrorHandler_1.default("Unable to fetch experiences", 500));
    }
});
// GET /api/destinations/:id
exports.getExperienceById = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const destination = await experiences_model_1.default.findById(id);
    if (!destination) {
        return next(new ErrorHandler_1.default("Destination not found", 404));
    }
    res.status(200).json({
        success: true,
        data: destination,
    });
});
// review for a destination
exports.experiencReview = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    var _a, _b;
    try {
        const { user, rating, comment, experienceId } = req.body;
        const experience = await experiences_model_1.default.findById(experienceId);
        if (!experience) {
            return next(new ErrorHandler_1.default("No experience found", 400));
        }
        const review = {
            user,
            rating,
            comment,
            experienceId,
        };
        const isReviewed = (_a = experience === null || experience === void 0 ? void 0 : experience.reviews) === null || _a === void 0 ? void 0 : _a.find((rev) => { var _a; return rev.user._id === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id); });
        if (isReviewed) {
            experience === null || experience === void 0 ? void 0 : experience.reviews.forEach((rev) => {
                var _a;
                if ((rev === null || rev === void 0 ? void 0 : rev.user._id) === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
                    (rev.rating = rating), (rev.comment = comment), (rev.user = user);
                }
            });
        }
        else {
            (_b = experience === null || experience === void 0 ? void 0 : experience.reviews) === null || _b === void 0 ? void 0 : _b.push(review);
        }
        let avg = 0;
        experience === null || experience === void 0 ? void 0 : experience.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        if (experience) {
            experience.rating = (avg / experience.reviews.length).toString();
        }
        await (experience === null || experience === void 0 ? void 0 : experience.save({ validateBeforeSave: false }));
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
//# sourceMappingURL=experiences.controller.js.map