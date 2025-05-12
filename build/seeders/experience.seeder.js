"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedExperiences;
const experience_1 = require("../data/experience");
const experiences_model_1 = __importDefault(require("../models/experiences.model"));
async function seedExperiences() {
    try {
        let skipped = 0, inserted = 0;
        for (const experience of experience_1.experiencesData) {
            const exists = await experiences_model_1.default.findOne({
                title: experience.title,
            });
            if (exists) {
                skipped++;
                continue;
            }
            await experiences_model_1.default.create(Object.assign(Object.assign({}, experience), { created_by: "System" }));
            inserted++;
        }
        console.log(`Seeding complete. Inserted: ${inserted}, Skipped: ${skipped}`);
    }
    catch (error) {
        console.error("Seeding error:", error);
    }
}
//# sourceMappingURL=experience.seeder.js.map