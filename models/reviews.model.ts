require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReviews extends Document {
  userId: mongoose.Types.ObjectId;
  destinationId?: mongoose.Types.ObjectId;
  experienceId?: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  content: string;
  visitDate?: string;
  tags?: string[];
}

const experiencesSchema = new Schema<IReviews>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "destinations",
    },
    experienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "experiences",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    visitDate: {
      type: String,
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

const ReviewsModel: Model<IReviews> = mongoose.model(
  "reviews",
  experiencesSchema
);

export default ReviewsModel;
