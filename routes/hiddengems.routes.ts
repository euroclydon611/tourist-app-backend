import express from "express";
import {
  createHiddengem,
  fetchHiddengems,
  getHiddengemById,
  hiddengemReview,
  updateHiddengem,
} from "../controller/hiddengems.controller";
const router = express.Router();

import multerMiddleware from "../middleware/multerMiddleware";

router.post(
  "/create-hiddengem",
  multerMiddleware().single("imageUrl"),
  createHiddengem
);

// Update destination
router.patch(
  "/update-hiddengem/:id",
  multerMiddleware().single("imageUrl"),
  updateHiddengem
);

router.get("/get-hiddengem", fetchHiddengems);

router.get("/hiddengem/:id", getHiddengemById);

router.put("/hiddengem/review", hiddengemReview);

export default router;
