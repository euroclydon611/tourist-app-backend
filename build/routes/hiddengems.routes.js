"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hiddengems_controller_1 = require("../controller/hiddengems.controller");
const router = express_1.default.Router();
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
router.post("/create-hiddengem", (0, multerMiddleware_1.default)().single("imageUrl"), hiddengems_controller_1.createHiddengem);
// Update destination
router.patch("/update-hiddengem/:id", (0, multerMiddleware_1.default)().single("imageUrl"), hiddengems_controller_1.updateHiddengem);
router.get("/get-hiddengem", hiddengems_controller_1.fetchHiddengems);
router.get("/hiddengem/:id", hiddengems_controller_1.getHiddengemById);
router.put("/hiddengem/review", hiddengems_controller_1.hiddengemReview);
exports.default = router;
//# sourceMappingURL=hiddengems.routes.js.map