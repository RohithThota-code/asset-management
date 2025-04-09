const Warehouse = require('../models/warehouse');

// GET all warehouses
const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch warehouses" });
  }
};

// POST create new warehouse
const createWarehouse = async (req, res) => {
  const { name, location, spaceOccupied, spaceLeft } = req.body;

  if (!name || !location) {
    return res.status(400).json({ error: "Name and location are required" });
  }

  try {
    const newWarehouse = new Warehouse({
      name,
      location,
      spaceOccupied,
      spaceLeft,
    });

    await newWarehouse.save();
    res.status(201).json(newWarehouse);
  } catch (err) {
    res.status(500).json({ error: "Failed to create warehouse" });
  }
};

// DELETE a warehouse
const deleteWarehouse = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Warehouse.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    res.json({ message: "Warehouse deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete warehouse" });
  }
};

module.exports = {
  getAllWarehouses,
  createWarehouse,
  deleteWarehouse,
};
