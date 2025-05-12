require("dotenv").config();
import { app } from "./app";
import connectDB from "./database/connectDB";
import seedDestinations from "./seeders/destination.seeder";
import seedExperiences from "./seeders/experience.seeder";


const port = parseInt(process.env.PORT || "5000", 10);

//create server
app.listen(port, "0.0.0.0", async () => {
  console.log(`Server is running on http://0.0.0.0:${process.env.PORT}`);
  connectDB();
  await seedDestinations();
  await seedExperiences()
});
