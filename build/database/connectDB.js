"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mongoose_1 = __importDefault(require("mongoose"));
const dbUri = process.env.DB_URI || "";
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(dbUri).then((data) => {
            console.log(`Database connceted with ${data.connection.host}`);
        });
    }
    catch (error) {
        console.log(error);
        setTimeout(connectDB, 500);
    }
};
exports.default = connectDB;
//# sourceMappingURL=connectDB.js.map