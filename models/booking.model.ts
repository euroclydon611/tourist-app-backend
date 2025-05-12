require("dotenv").config();
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  experienceId?: mongoose.Types.ObjectId;
  destinationId?: mongoose.Types.ObjectId;
  hiddenGemId?: mongoose.Types.ObjectId;
  date: Date;
  guests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
}

const bookingSchema: Schema<IBooking> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    experienceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "experiences",
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "destinations",
    },
    hiddenGemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hiddengem",
    },
    date: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BookingModel: Model<IBooking> = mongoose.model("bookings", bookingSchema);

export default BookingModel;
