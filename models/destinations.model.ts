require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICoordinates {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
}

export interface IDestination extends Document {
  name: string;
  region: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  rating: string;
  coordinates: ICoordinates;
  topAttractions: string[];
  tags: string[];
  price?: number;
  
  reviews: {
    user: Object;
    rating: number;
    comment: string;
    destinationId: string;
    createdAt: Date;
  }[];
}

const destinationSchema = new Schema<IDestination>(
  {
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
          validator: (value: number[]) => value.length === 2,
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },
    topAttractions: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const DestinationModel: Model<IDestination> = mongoose.model(
  "destinations",
  destinationSchema
);

export default DestinationModel;
