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
    <div className="px-6 py-10 max-w-6xl mx-auto space-y-12">
      <h1 className="text-4xl font-bold text-center text-gray-800">
        Admin Dashboard
      </h1>
  
      {/* Employees Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-700">Employees</h2>
          <button
            onClick={handleRegisterRedirect}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700"
          >
            ➕ Register New User
          </button>
        </div>
  
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-center table-auto border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 border">Name</th>
                <th className="px-6 py-3 border">Email</th>
                <th className="px-6 py-3 border">Can Update?</th>
                <th className="px-6 py-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{user.username}</td>
                  <td className="px-4 py-3 border">{user.email}</td>
                  <td className="px-4 py-3 border">
                    <span className={`font-semibold ${user.canUpdate ? 'text-green-600' : 'text-red-500'}`}>
                      {user.canUpdate ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border">
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
      </section>
  
      {/* Update Logs Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700">Update Logs</h2>
  
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-500">No updates found.</p>
          ) : (
            <div className="grid gap-6">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md bg-gray-50 p-4"
                >
                  <p className="text-gray-800 text-sm">
                    <strong>{log.updatedBy}</strong> updated asset <strong>{log.asset}</strong> in warehouse <strong>{log.warehouse}</strong>
                    <br />
                    New Quantity: <strong>{log.quantity}</strong>
                    <br />
                    On: <span className="text-gray-600">{new Date(log.date).toLocaleString()}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
  export default Admin;