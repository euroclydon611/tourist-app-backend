"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsersByAdmin = exports.getUserInfoById = exports.updateUserPassword = exports.deleteUserAddress = exports.updateUserAddresses = exports.updateUserAvatar = exports.updateUserInfo = exports.UserLogout = exports.socialAuth = exports.LoadUser = exports.UserLogin = exports.UserActivation = exports.UserRegistration = void 0;
const fs_1 = __importDefault(require("fs"));
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncErrors_1 = __importDefault(require("../middleware/catchAsyncErrors"));
const SendMail_1 = __importDefault(require("../utils/SendMail"));
const CreateActivationToken_1 = __importDefault(require("../utils/CreateActivationToken"));
const jwt_1 = require("../utils/jwt");
// user account registration
exports.UserRegistration = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        const { name, email, country, aboutMe, phoneNumber, password } = req.body;
        if (!req.file) {
            return next(new ErrorHandler_1.default("Select image file to proceed", 400));
        }
        const avatar = req.file.filename;
        const isEmailExist = await user_model_1.default.findOne({ email });
        if (isEmailExist) {
            const filename = req.file && req.file.filename;
            const filePath = `uploads/${filename}`;
            fs_1.default.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ message: "Error deleting file" });
                }
            });
            return next(new ErrorHandler_1.default("Email already exists", 400));
        }
        const user = {
            name,
            email,
            password,
            country,
            aboutMe,
            phoneNumber,
            avatar,
        };
        const activationToken = (0, CreateActivationToken_1.default)(user);
        const activationUrl = `http://localhost:9098/activation/${activationToken.token}`;
        const data = { user: { name: user.name }, activationUrl };
        const encodedToken = encodeURIComponent(activationToken.token.replace(/\./g, "%2E"));
        try {
            await (0, SendMail_1.default)({
                email: user.email,
                subject: "Activate your account",
                template: "activation_mail.ejs",
                data,
            });
            // await UserModel.create(user);
            res.status(201).json({
                success: true,
                message: `Please check your email ${user.email} to activate your account`,
                activationToken: activationToken.token,
            });
        }
        catch (error) {
            console.log("Send Mail Error:", error); // Log the entire error for better debugging
            return next(new ErrorHandler_1.default(error.message, 400));
        }
    }
    catch (error) {
        console.log("error 3", error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.UserActivation = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        const { activation_token } = req.body;
        console.log("activation_token", activation_token);
        const newUser = jsonwebtoken_1.default.verify(activation_token, process.env.ACTIVATION_SECRET);
        console.log("newUser", newUser);
        if (!newUser) {
            return next(new ErrorHandler_1.default("Invalid activation token", 400));
        }
        const { name, email, password, country, aboutMe, phoneNumber, avatar, } = newUser.user;
        const isEmailExist = await user_model_1.default.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandler_1.default("Email already exists", 400));
        }
        // const user = await UserModel.create({ name, email, password });
        const user = {
            name,
            email,
            password,
            country,
            aboutMe,
            phoneNumber,
            avatar,
        };
        await user_model_1.default.create(user);
        (0, jwt_1.sendToken)(user, 201, res);
        res
            .status(201)
            .json({ success: true, message: "Account activated successfully" });
    }
    catch (error) {
        console.log("error occurred", error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.UserLogin = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default("Please enter your email and password", 400));
        }
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("Incorrect email or password", 400));
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler_1.default("Incorrect email or password", 400));
        }
        (0, jwt_1.sendToken)(user, 200, res);
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//load user
exports.LoadUser = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    var _a;
    try {
        const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        // console.log(user);
        if (!user) {
            return next(new ErrorHandler_1.default("Your session has timed out. Log in again to continue", 400));
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.socialAuth = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        const { email, name, avatar } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            const newUser = await user_model_1.default.create({ email, name, avatar });
            (0, jwt_1.sendToken)(newUser, 200, res);
        }
        else {
            (0, jwt_1.sendToken)(user, 200, res);
        }
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//logout user
exports.UserLogout = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        console.log(req.user);
        res.status(200).json({
            success: true,
            message: "Logout successful!",
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//update user
exports.updateUserInfo = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        const { email, password, phoneNumber, country, aboutMe, name } = req.body;
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 400));
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return next(new ErrorHandler_1.default("Please provide the correct information", 400));
        }
        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;
        user.country = country;
        user.aboutMe = aboutMe;
        await user.save();
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//update the user avatar
exports.updateUserAvatar = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    var _a, _b;
    try {
        const existsUser = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!existsUser) {
            return next(new ErrorHandler_1.default("User not found", 404));
        }
        // Check if the avatar exists and if it's stored locally
        const existAvatarPath = (existsUser === null || existsUser === void 0 ? void 0 : existsUser.avatar)
            ? `uploads/${existsUser.avatar}`
            : null;
        if (existAvatarPath && fs_1.default.existsSync(existAvatarPath)) {
            // If the avatar exists and is stored locally, unlink it
            fs_1.default.unlinkSync(existAvatarPath);
        }
        if (!req.file) {
            return next(new ErrorHandler_1.default("Select image file to proceed", 400));
        }
        const fileUrl = req.file.filename;
        const user = await user_model_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, {
            avatar: fileUrl,
        });
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//update user addressed
exports.updateUserAddresses = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    var _a, _b, _c;
    try {
        const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        const sameTypeAddress = (_b = user === null || user === void 0 ? void 0 : user.addresses) === null || _b === void 0 ? void 0 : _b.find((address) => address.addressType === req.body.addressType);
        if (sameTypeAddress) {
            return next(new ErrorHandler_1.default(`${req.body.addressType} address already exists`, 400));
        }
        const existsAddress = user === null || user === void 0 ? void 0 : user.addresses.find((address) => address._id === req.body._id);
        if (existsAddress) {
            Object.assign(existsAddress, req.body);
        }
        else {
            // add the new address to the array
            (_c = user === null || user === void 0 ? void 0 : user.addresses) === null || _c === void 0 ? void 0 : _c.push(req.body);
        }
        await (user === null || user === void 0 ? void 0 : user.save());
        res.status(200).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//delete user addressed
exports.deleteUserAddress = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const addressId = req.params.id;
        console.log(addressId);
        await user_model_1.default.updateOne({
            _id: userId,
        }, { $pull: { addresses: { _id: addressId } } });
        const user = await user_model_1.default.findById(userId);
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        console.error(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//update the user password
exports.updateUserPassword = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    var _a;
    try {
        const user = await user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select("+password");
        if (!user) {
            return next(new ErrorHandler_1.default("User not found", 400));
        }
        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
        if (!isPasswordMatched) {
            return next(new ErrorHandler_1.default("Old password is incorrect!", 400));
        }
        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(new ErrorHandler_1.default("Password doesn't matched with each other!", 400));
        }
        user.password = req.body.newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password updated successfully!",
        });
    }
    catch (error) {
        console.error(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// find user information with the userId
exports.getUserInfoById = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        const user = await user_model_1.default.findById(req.params.id);
        res.status(201).json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// all users --- for admin
exports.getAllUsersByAdmin = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        console.log("fetching users");
        const users = await user_model_1.default.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            users,
        });
    }
    catch (error) {
        console.error(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
// all users --- for admin
exports.deleteUser = (0, catchAsyncErrors_1.default)(async (req, res, next) => {
    try {
        const user = await user_model_1.default.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler_1.default("User is not available with this id", 400));
        }
        await user_model_1.default.findByIdAndDelete(req.params.id);
        res.status(201).json({
            success: true,
            message: "User deleted successfully!",
        });
    }
    catch (error) {
        console.error(error);
        return next(new ErrorHandler_1.default(error.message, 400));
    }
});
//# sourceMappingURL=user.controller.js.map