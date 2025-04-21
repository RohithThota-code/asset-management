const express = require('express');
const { authenticateToken } = require("../controllers/authController");
const axios = require('axios');
const Warehouse = require("../models/warehouse");
const prepareData = require('../controllers/prepareData');

const router = express.Router();
const {
  getAllWarehouses,
  createWarehouse,
  deleteWarehouse
} = require('../controllers/warehouseController');



router.use(express.json());

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
router.put("/:warehouseId/assets/:assetId", authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    const warehouse = await Warehouse.findById(req.params.warehouseId);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
    

    const asset = warehouse.assets.id(req.params.assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    console.log("Updating asset:", asset._id, "to quantity:", req.body.quantity);

    

    if (quantity !== undefined) {
      asset.quantity = quantity;
      asset.history.push({
        quantity,
        updatedBy: {
          employeeId: req.user._id,   // from auth middleware
          name: req.user.name         // or username/email
        }
      });
    }
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


router.get("/:warehouseId/asset-history", async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.warehouseId);
    if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });

    const allEntries = [];

    warehouse.assets.forEach(asset => {
      asset.history.forEach(entry => {
        allEntries.push({
          assetName: asset.name,
          quantity: entry.quantity,
          date: entry.date,
        });
      });
    });

    res.json(allEntries);
  } catch (err) {
    console.error("Error fetching asset history:", err);
    res.status(500).json({ error: "Failed to fetch asset history" });
  }
});


router.post("/:assetId/forecast", async (req, res) => {
  try {
    const assetId = req.params.assetId;
    const { assetName, data } = await prepareData(assetId);

    if (!assetName || !data.length) {
      return res.status(400).json({ error: "Asset name or data missing in history" });
    }

    const flaskRes = await axios.post("http://localhost:5001/forecast", {
      assetName: assetName
    });

    res.json(flaskRes.data);
  } catch (err) {
    console.error("Forecast error:", err.message);
    res.status(500).json({ error: "Failed to forecast demand" });
  }
});



module.exports = router;
