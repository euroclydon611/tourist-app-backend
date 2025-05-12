"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const destinations_controller_1 = require("../controller/destinations.controller");
const router = express_1.default.Router();
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
router.post("/create-destination", (0, multerMiddleware_1.default)().single("imageUrl"), destinations_controller_1.createDestination);
// Update destination
router.patch("/update-destination/:id", (0, multerMiddleware_1.default)().single("imageUrl"), destinations_controller_1.updateDestination);
router.get("/get-destinations", destinations_controller_1.fetchDestinations);
router.get("/destination/:id", destinations_controller_1.getDestinationById);
router.put("/destination/review", destinations_controller_1.destinationReview);
exports.default = router;
//# sourceMappingURL=destinations.routes.js.map