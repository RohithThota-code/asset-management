const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  history: [
    {
      quantity: Number,
      date: { type: Date, default: Date.now },
      updatedBy: {
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String
      }
    }
  ]
  
}, { timestamps: true });


const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    location: { type: String, required: true },
    spaceOccupied: { type: Number, required: true, min: 0 },
    spaceLeft: { type: Number, required: true, min: 0 },
    assets: [assetSchema]
  },
  { timestamps: true }
);

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports = Warehouse;
