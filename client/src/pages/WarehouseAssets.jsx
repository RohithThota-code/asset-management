import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";

const WarehouseAssets = () => {
  const { id } = useParams();
  const [assets, setAssets] = useState([]);
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "",
    quantity: 0,
    unitPrice: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssets();
  }, [id]);

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`/api/warehouses/${id}`);
      setWarehouse(res.data);
      setAssets(res.data.assets || []);
    } catch (err) {
      console.error("Error fetching warehouse assets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewAsset({ ...newAsset, [e.target.name]: e.target.value });
  };

  const handleAddAsset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/warehouses/${id}/assets`, newAsset);
      setNewAsset({ name: "", category: "", quantity: 0, unitPrice: 0 });
      fetchAssets();
    } catch (err) {
      console.error("Error adding asset:", err);
    }
  };

  const handleUpdateQuantity = async (assetId, newQuantity) => {
    try {
      await axios.put(`/api/warehouses/${id}/assets/${assetId}`, {
        quantity: newQuantity,
      });
      fetchAssets();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      await axios.delete(`/api/warehouses/${id}/assets/${assetId}`);
      fetchAssets();
    } catch (err) {
      console.error("Error deleting asset:", err);
    }
  };

  return (
    <div className="p-6">
      {loading ? (
        <p>Loading assets...</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">
            Assets in {warehouse?.name}
          </h1>

          {/* Add Asset Form */}
          <form
            onSubmit={handleAddAsset}
            className="mb-6 bg-gray-50 p-4 rounded shadow"
          >
            <h2 className="text-lg font-semibold mb-2">Add New Asset</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newAsset.name}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newAsset.category}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newAsset.quantity}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                name="unitPrice"
                placeholder="Unit Price"
                value={newAsset.unitPrice}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Asset
            </button>
          </form>

          {/* Asset List */}
          {assets.length === 0 ? (
            <p>No assets found.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <li
                  key={asset._id}
                  className="bg-white shadow rounded p-4 border border-gray-100"
                >
                  <h2 className="text-lg font-semibold">{asset.name}</h2>
                  <p>Category: {asset.category}</p>
                  <p>Quantity: {asset.quantity}</p>
                  <p>Unit Price: ₹{asset.unitPrice}</p>

                  {/* Quantity Update */}
                  <div className="flex items-center mt-2 gap-2">
                    <input
                      type="number"
                      placeholder="New Quantity"
                      className="border p-1 w-24 rounded"
                      onChange={(e) =>
                        asset.newQuantity = e.target.value
                      }
                    />
                    <button
                      onClick={() =>
                        handleUpdateQuantity(asset._id, asset.newQuantity)
                      }
                      className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 text-xs rounded"
                    >
                      Update
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteAsset(asset._id)}
                    className="mt-3 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete Asset
                  </button>
                  <button
                    onClick={() => navigate(`/forecast/${asset._id}`)}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    🔮 Forecast
                  </button>

                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default WarehouseAssets;

