import { experiencesData } from "../data/experience";
import ExperienceModel from "../models/experiences.model";

export default async function seedExperiences() {
  try {
    let skipped = 0,
      inserted = 0;

    for (const experience of experiencesData) {
      const exists = await ExperienceModel.findOne({
        title: experience.title,
      });

      if (exists) {
        skipped++;
        continue;
      }

      await ExperienceModel.create({
        ...experience,
        created_by: "System",
      });

      inserted++;
    }

    console.log(`Seeding complete. Inserted: ${inserted}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("Seeding error:", error);
  }
}
