"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedDestinations;
const destinations_1 = require("../data/destinations");
const destinations_model_1 = __importDefault(require("../models/destinations.model"));
async function seedDestinations() {
    try {
        let skipped = 0, inserted = 0;
        for (const destination of destinations_1.destinationsData) {
            const exists = await destinations_model_1.default.findOne({
                name: destination.name,
                region: destination.region,
            });
            if (exists) {
                skipped++;
                continue;
            }
            await destinations_model_1.default.create(Object.assign(Object.assign({}, destination), { created_by: "System" }));
            inserted++;
        }
        console.log(`Seeding complete. Inserted: ${inserted}, Skipped: ${skipped}`);
    }
    catch (error) {
        console.error("Seeding error:", error);
    }
}
//# sourceMappingURL=destination.seeder.js.map