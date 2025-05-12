import { destinationsData } from "../data/destinations";
import DestinationModel from "../models/destinations.model";

export default async function seedDestinations() {
  try {
    let skipped = 0, inserted = 0;

    for (const destination of destinationsData) {
      const exists = await DestinationModel.findOne({
        name: destination.name,
        region: destination.region,
      });

      if (exists) {
        skipped++;
        continue;
      }

      await DestinationModel.create({
        ...destination,
        created_by: "System",
      });

      inserted++;
    }

    console.log(`Seeding complete. Inserted: ${inserted}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

