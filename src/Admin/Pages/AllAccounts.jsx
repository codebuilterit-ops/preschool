import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingUsers } from "../../api/adminapi";
import { blockUser, unblockUser, approveUser } from "../../api/adminapi";

const AllAccounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchAccounts(token);
    }
  }, [navigate]);

  const fetchAccounts = async (token) => {
    setLoading(true);
    try {
      const res = await getPendingUsers(token);
      setAccounts(res.data || []);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    setActionLoading(user.id);
    const token = localStorage.getItem("admin_token");
    try {
      if (user.status === "blocked") {
        await unblockUser(user.id, token);
      } else if (user.status === "approved") {
        await blockUser(user.id, token);
      } else if (user.status === "pending") {
        await approveUser(user.id, token);
      }
      await fetchAccounts(token);
    } catch (err) {
      // handle error
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6">All Accounts</h1>
        {loading ? (
          <p>Loading...</p>
        ) : accounts.length === 0 ? (
          <p>No accounts found.</p>
        ) : (
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th className="py-2 px-4">Preschool Name</th>
                <th className="py-2 px-4">District</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="py-2 px-4">{user.preschoolname}</td>
                  <td className="py-2 px-4">{user.district}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.phonenumber}</td>
                  <td className="py-2 px-4">{user.status}</td>
                  <td className="py-2 px-4">
                    {user.status === "pending" ? (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => handleToggleStatus(user)}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? "Approving..." : "Approve"}
                      </button>
                    ) : (
                      <button
                        className={`px-4 py-2 rounded text-white ${
                          user.status === "blocked"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                        onClick={() => handleToggleStatus(user)}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id
                          ? user.status === "blocked"
                            ? "Unblocking..."
                            : "Blocking..."
                          : user.status === "blocked"
                          ? "Unblock"
                          : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AllAccounts;
