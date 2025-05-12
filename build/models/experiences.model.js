"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mongoose_1 = __importStar(require("mongoose"));
const experiencesSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    rating: {
        type: String,
        required: [true, "Please provide a rating"],
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"],
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true,
    },
    duration: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: Object,
            },
            rating: {
                type: Number,
            },
            comment: {
                type: String,
            },
            destinationId: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
});
const ExperienceModel = mongoose_1.default.model("experiences", experiencesSchema);
exports.default = ExperienceModel;
//# sourceMappingURL=experiences.model.js.map