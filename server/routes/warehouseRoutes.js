const express = require('express');
const router = express.Router();
const {
  getAllWarehouses,
  createWarehouse,
  deleteWarehouse
} = require('../controllers/warehouseController');
const Warehouse = require("../models/warehouse");

// Get all warehouses
router.get('/', getAllWarehouses);

// Create a new warehouse
router.post('/', createWarehouse);

// Delete a warehouse
router.delete('/:id', deleteWarehouse);

// Get a single warehouse by ID
router.get("/:id", async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
    res.json(warehouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add asset to warehouse (embedded)
router.post("/:id/assets", async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    const { name, category, quantity, unitPrice } = req.body;

    warehouse.assets.push({ name, category, quantity, unitPrice });
    await warehouse.save();

    res.status(201).json({ message: "Asset added successfully", warehouse });
  } catch (err) {
    console.error("Error adding asset:", err);
    res.status(500).json({ error: "Failed to add asset" });
  }
});

// ✅ Update asset quantity in warehouse
router.put("/:warehouseId/assets/:assetId", async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.warehouseId);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    const asset = warehouse.assets.id(req.params.assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    if (req.body.quantity !== undefined) asset.Quantity = req.body.Quantity;
    await warehouse.save();

    res.json({ message: "Asset updated", asset });
  } catch (err) {
    console.error("Error updating asset:", err);
    res.status(500).json({ error: "Failed to update asset" });
  }
});

// ✅ Delete asset from warehouse
router.delete("/:warehouseId/assets/:assetId", async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.warehouseId);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    warehouse.assets = warehouse.assets.filter(asset => asset._id.toString() !== req.params.assetId);
    await warehouse.save();

    res.json({ message: "Asset deleted", warehouse });
  } catch (err) {
    console.error("Error deleting asset:", err);
    res.status(500).json({ error: "Failed to delete asset" });
  }
});

module.exports = router;
