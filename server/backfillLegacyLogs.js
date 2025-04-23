
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Warehouse = require('./models/warehouse'); 


mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log(" Connected to MongoDB");
    backfillUnknownUpdaters();
  })
  .catch(err => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

async function backfillUnknownUpdaters() {
  try {
    const warehouses = await Warehouse.find();

    for (const wh of warehouses) {
      let modified = false;

      wh.assets.forEach(asset => {
        asset.history.forEach(entry => {
          if (!entry.updatedBy || !entry.updatedBy.name) {
            entry.updatedBy = {
              name: "Legacy User",
              employeeId: null
            };
            modified = true;
          }
        });
      });

      if (modified) {
        await wh.save();
        console.log(` Updated warehouse: ${wh.name}`);
      }
    }

    console.log(" Backfill complete.");
    process.exit(0);
  } catch (err) {
    console.error(" Error during backfill:", err);
    process.exit(1);
  }
}
