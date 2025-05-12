import express from "express";
import {
  createExperience,
  fetchExperiences,
  getExperienceById,
  experiencReview,
  updateExperience
} from "../controller/experiences.controller";
const router = express.Router();

import multerMiddleware from "../middleware/multerMiddleware";

router.post(
  "/create-experience",
  multerMiddleware().single("imageUrl"),
  createExperience
);


// Update destination
router.patch(
  "/update-experience/:id",
  multerMiddleware().single("imageUrl"),
  updateExperience
);

router.get("/get-experiences", fetchExperiences);

router.get("/experience/:id", getExperienceById);


router.put("/experience/review", experiencReview);


export default router;
