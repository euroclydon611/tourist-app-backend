"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const experiences_controller_1 = require("../controller/experiences.controller");
const router = express_1.default.Router();
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
router.post("/create-experience", (0, multerMiddleware_1.default)().single("imageUrl"), experiences_controller_1.createExperience);
// Update destination
router.patch("/update-experience/:id", (0, multerMiddleware_1.default)().single("imageUrl"), experiences_controller_1.updateExperience);
router.get("/get-experiences", experiences_controller_1.fetchExperiences);
router.get("/experience/:id", experiences_controller_1.getExperienceById);
router.put("/experience/review", experiences_controller_1.experiencReview);
exports.default = router;
//# sourceMappingURL=experiences.routes.js.map