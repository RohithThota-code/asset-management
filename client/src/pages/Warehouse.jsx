import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: "",
    spaceOccupied: 0,
    spaceLeft: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get("/api/warehouses");
      setWarehouses(res.data);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (warehouseId) => {
    navigate(`/warehouse/${warehouseId}`);
  };

  const handleInputChange = (e) => {
    setNewWarehouse({ ...newWarehouse, [e.target.name]: e.target.value });
  };

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/warehouses", newWarehouse);
      setNewWarehouse({ name: "", location: "", spaceOccupied: 0, spaceLeft: 0 });
      fetchWarehouses(); // Refresh list
    } catch (err) {
      console.error("Error adding warehouse:", err);
    }
  };

  const handleDeleteWarehouse = async (id) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      try {
        await axios.delete(`/api/warehouses/${id}`);
        fetchWarehouses(); // Refresh list
      } catch (err) {
        console.error("Error deleting warehouse:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Warehouses</h1>

      {/* Add Warehouse Form */}
      <form
        onSubmit={handleAddWarehouse}
        className="mb-8 bg-gray-100 p-4 rounded shadow-md"
      >
        <h2 className="text-xl font-semibold mb-2">Add New Warehouse</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Warehouse Name"
            value={newWarehouse.name}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={newWarehouse.location}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="spaceOccupied"
            placeholder="Space Occupied"
            value={newWarehouse.spaceOccupied}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            name="spaceLeft"
            placeholder="Space Left"
            value={newWarehouse.spaceLeft}
            onChange={handleInputChange}
            className="border p-2 rounded"
            required
          />
        </div>
        <br />
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Warehouse
        </button>
      </form>

      {/* Warehouse List */}
      {loading ? (
        <p>Loading...</p>
      ) : warehouses.length === 0 ? (
        <p>No warehouses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {warehouses.map((w) => (
        <div
          key={w._id}
          className="bg-white shadow-lg p-6 rounded-xl transition relative"
        >
        <div onClick={() => handleClick(w._id)} className="cursor-pointer">
        <h2 className="text-xl font-semibold">{w.name}</h2>
        <p className="text-gray-600">📍 {w.location}</p>
        <p className="text-sm mt-2">Occupied: {w.spaceOccupied} sq ft</p>
        <p className="text-sm">Left: {w.spaceLeft} sq ft</p>
        </div>

        <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => navigate(`/history/${w._id}`)}
          
        >
          View History
        </button>

        <button
          onClick={() => handleDeleteWarehouse(w._id)}
          className="text-red-500 hover:text-red-700 text-sm"
          title="Delete warehouse"
            >
          🗑️ Delete
        </button>
          </div>
        </div>
        ))}

        </div>
      )}
    </div>
  );
};

export default Warehouse;


