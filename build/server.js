"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const app_1 = require("./app");
const connectDB_1 = __importDefault(require("./database/connectDB"));
const destination_seeder_1 = __importDefault(require("./seeders/destination.seeder"));
const experience_seeder_1 = __importDefault(require("./seeders/experience.seeder"));
const port = parseInt(process.env.PORT || "5000", 10);
//create server
app_1.app.listen(port, "0.0.0.0", async () => {
    console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
    (0, connectDB_1.default)();
    await (0, destination_seeder_1.default)();
    await (0, experience_seeder_1.default)();
});
//# sourceMappingURL=server.js.map