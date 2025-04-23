const express = require('express');
const router = express.Router();
const User = require('../models/user');
const requireAdmin = require('../controllers/requireAdmin');
const { authenticateToken } = require('../controllers/authController');
const Warehouse = require('../models/warehouse'); 


router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


router.put('/users/:id/update-permission', authenticateToken,requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.canUpdate = !user.canUpdate;
    await user.save();

    res.json({ message: "Permission updated", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update permission" });
  }
});

router.get('/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const warehouses = await Warehouse.find({}, 'name assets.history assets.name').populate('assets.history.updatedBy.employeeId', 'username email');
    
    const logs = [];

    warehouses.forEach(warehouse => {
      warehouse.assets.forEach(asset => {
        asset.history.forEach(entry => {
          logs.push({
            warehouse: warehouse.name,
            asset: asset.name,
            quantity: entry.quantity,
            date: entry.date,
            updatedBy: entry.updatedBy?.name || 'Unknown'
          });
        });
      });
    });

    res.json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});


module.exports = router;
