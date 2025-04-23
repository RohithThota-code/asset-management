import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get("/api/admin/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUpdatePermission = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/admin/users/${userId}/update-permission`, {
        canUpdate: !currentStatus,
      });
      fetchUsers();
    } catch (err) {
      console.error("Error updating permission:", err);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>
      <br />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Employees</h2>
        <br />
      </div>

      <div className="bg-white rounded shadow p-6">
        <table className="w-full table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-3">Name</th>
              <th className="border px-4 py-3">Email</th>
              <th className="border px-4 py-3">Can Update?</th>
              <th className="border px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  {user.canUpdate ? "Yes" : "No"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => toggleUpdatePermission(user._id, user.canUpdate)}
                    className="px-3 py-1 text-sm rounded bg-yellow-500 hover:bg-yellow-600 text-white"
                  >
                    Toggle Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center">
        
        <br />
        <button
          onClick={handleRegisterRedirect}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ➕ Register New User
        </button>
        
      </div>

      <div>
      <br />
      <br />
        <h2 className="text-2xl font-semibold mb-4">Update Logs</h2>
        <br />
        <div className="bg-white rounded shadow p-6 space-y-4">
          {loading ? (
            <p>Loading logs...</p>
          ) : logs.length === 0 ? (
            <p>No updates found.</p>
          ) : (
            <div className="grid gap-4">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded p-4 bg-gray-50"
                >
                  <p className="text-sm text-gray-800">
                     <strong>{log.updatedBy}</strong> updated asset <strong>{log.asset}</strong> in warehouse <strong>{log.warehouse}</strong>
                    <br />
                     New Quantity: <strong>{log.quantity}</strong>
                    <br />
                     On: <span className="text-gray-600">{new Date(log.date).toLocaleString()}</span>
                     <hr className="my-2 border-gray-300" />
                     <br />

                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
