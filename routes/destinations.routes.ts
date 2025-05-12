import express from "express";
import {
  createDestination,
  fetchDestinations,
  getDestinationById,
  destinationReview,
  updateDestination,
} from "../controller/destinations.controller";
const router = express.Router();

import multerMiddleware from "../middleware/multerMiddleware";

router.post(
  "/create-destination",
  multerMiddleware().single("imageUrl"),
  createDestination
);

// Update destination
router.patch(
  "/update-destination/:id",
  multerMiddleware().single("imageUrl"),
  updateDestination
);

router.get("/get-destinations", fetchDestinations);

router.get("/destination/:id", getDestinationById);

router.put("/destination/review", destinationReview);

export default router;
