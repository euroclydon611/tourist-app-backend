import express from "express";
const router = express.Router();

import {
  UserRegistration,
  UserActivation,
  UserLogin,
  LoadUser,
  socialAuth,
  UserLogout,
  updateUserInfo,
  updateUserAvatar,
  updateUserAddresses,
  updateUserPassword,
  getUserInfoById,
  getAllUsersByAdmin,
  deleteUser,
  deleteUserAddress,
} from "../controller/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import multerMiddleware from "../middleware/multerMiddleware";

router.post(
  "/registration",
  multerMiddleware().single("file"),
  UserRegistration
);
router.post("/activate-user", UserActivation);
router.post("/login", UserLogin);
router.get("/user", isAuthenticated, LoadUser);
router.post("/social-auth", socialAuth);
router.post("/logout", isAuthenticated, UserLogout);
router.get("/user-info/:id", getUserInfoById);
router.get(
  "/admin-all-users",
  isAuthenticated,
  authorizeRoles("Admin"),
  getAllUsersByAdmin
);

router.put("/update-user", isAuthenticated, updateUserInfo);
router.put("/update-user-addresses", isAuthenticated, updateUserAddresses);
router.delete("/delete-user-address/:id", isAuthenticated, deleteUserAddress);
router.put("/update-user-password", isAuthenticated, updateUserPassword);
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizeRoles("Admin"),
  deleteUser
);

router.put(
  "/update-user-avatar",
  isAuthenticated,
  multerMiddleware().single("file"),
  updateUserAvatar
);

export default router;
