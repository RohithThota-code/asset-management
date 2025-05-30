const fs = require('fs');
const path = require('path');
const Warehouse = require('../models/warehouse');

const prepareData = async (assetId) => {
  try {
    const warehouses = await Warehouse.find({});
    let targetAsset = null;

    for (const warehouse of warehouses) {
      const asset = warehouse.assets.id(assetId);
      if (asset) {
        targetAsset = asset;
        break;
      }
    }

    if (!targetAsset) {
      throw new Error('Asset not found');
    }

    const history = [...targetAsset.history].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const demandData = [];
    for (let i = 1; i < history.length; i++) {
      const previous = history[i - 1];
      const current = history[i];

      const quantityChange = previous.quantity - current.quantity;

      if (quantityChange > 0) {
        demandData.push({
          date: current.date,
          quantity: quantityChange  
        });
      }
    }

    
    const filePath = path.join(__dirname, "../../flask/data", `${targetAsset.name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(demandData, null, 2));
    console.log(" Saved demand data to:", filePath);

    return {
      assetName: targetAsset.name,
      data: demandData
    };
  } catch (error) {
    console.error('Error preparing demand data:', error.message);
    throw error;
  }
};

module.exports = prepareData;


