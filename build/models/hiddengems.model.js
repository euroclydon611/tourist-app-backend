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
const hiddenGemSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please enter the destination name"],
        trim: true,
    },
    region: {
        type: String,
        required: [true, "Please specify the region"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please provide a description"],
    },
    shortDescription: {
        type: String,
        required: [true, "Please provide a short description"],
        maxlength: [200, "Short description should not exceed 200 characters"],
    },
    imageUrl: {
        type: String,
        required: [true, "Image URL is required"],
    },
    rating: {
        type: String,
        required: [true, "Please provide a rating"],
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
    coordinates: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point",
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true,
            validate: {
                validator: (value) => value.length === 2,
                message: "Coordinates must be an array of [longitude, latitude]",
            },
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
const HiddenGemModel = mongoose_1.default.model("hiddengem", hiddenGemSchema);
exports.default = HiddenGemModel;
//# sourceMappingURL=hiddengems.model.js.map