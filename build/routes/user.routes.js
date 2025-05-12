"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_controller_1 = require("../controller/user.controller");
const auth_1 = require("../middleware/auth");
const multerMiddleware_1 = __importDefault(require("../middleware/multerMiddleware"));
router.post("/registration", (0, multerMiddleware_1.default)().single("file"), user_controller_1.UserRegistration);
router.post("/activate-user", user_controller_1.UserActivation);
router.post("/login", user_controller_1.UserLogin);
router.get("/user", auth_1.isAuthenticated, user_controller_1.LoadUser);
router.post("/social-auth", user_controller_1.socialAuth);
router.post("/logout", auth_1.isAuthenticated, user_controller_1.UserLogout);
router.get("/user-info/:id", user_controller_1.getUserInfoById);
router.get("/admin-all-users", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("Admin"), user_controller_1.getAllUsersByAdmin);
router.put("/update-user", auth_1.isAuthenticated, user_controller_1.updateUserInfo);
router.put("/update-user-addresses", auth_1.isAuthenticated, user_controller_1.updateUserAddresses);
router.delete("/delete-user-address/:id", auth_1.isAuthenticated, user_controller_1.deleteUserAddress);
router.put("/update-user-password", auth_1.isAuthenticated, user_controller_1.updateUserPassword);
router.delete("/delete-user/:id", auth_1.isAuthenticated, (0, auth_1.authorizeRoles)("Admin"), user_controller_1.deleteUser);
router.put("/update-user-avatar", auth_1.isAuthenticated, (0, multerMiddleware_1.default)().single("file"), user_controller_1.updateUserAvatar);
exports.default = router;
//# sourceMappingURL=user.routes.js.map