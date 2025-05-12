"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToken = exports.accessTokenOptions = void 0;
require("dotenv").config();
//parse environment variables to integrates with fallback values
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
// options for cookies
exports.accessTokenOptions = {
    expires: new Date(Date.now() * accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
};
const sendToken = (user, statusCode, res, options = {}) => {
    const accessToken = user.SignAccessToken();
    res.cookie("access_token", accessToken, exports.accessTokenOptions);
    const { _id, email, name, avatar } = user;
    res.status(statusCode).json({
        success: true,
        user: {
            _id,
            email,
            name,
            avatar,
        },
        options,
        accessToken,
    });
};
exports.sendToken = sendToken;
//# sourceMappingURL=jwt.js.map