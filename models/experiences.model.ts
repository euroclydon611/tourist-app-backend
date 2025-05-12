require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IExperiences extends Document {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  location: string;
  duration?: string;
  price?: number;
  rating: string;
  reviews: {
    user: Object;
    rating: number;
    comment: string;
    experienceId: string;
    createdAt: Date;
  }[];
}

const experiencesSchema = new Schema<IExperiences>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ExperienceModel: Model<IExperiences> = mongoose.model(
  "experiences",
  experiencesSchema
);

export default ExperienceModel;
