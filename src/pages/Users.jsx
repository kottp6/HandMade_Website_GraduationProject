import React, { useEffect, useState } from "react";
import PageLayout from "../Components/PageLayout/PageLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); 

  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Users"));
        const userList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.role === "customer");

        setUsers(userList);
        setFilteredUsers(userList);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false); 
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.displayName?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, users]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  return (
    <PageLayout title="Customers">
      <div className="p-6 space-y-6 bg-[#F5F5F1] rounded-xl shadow">
        {/* 👉 Search */}
        <div className="flex justify-between items-center mt-2">
          <h2 className="text-2xl font-bold text-[#A78074]">Customer List</h2>
          <input
            type="text"
            placeholder="Search by name or email"
            className="border px-3 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#A78074]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 👉 Table OR Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-[#A78074] text-lg animate-pulse">Loading customers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#E0E0DC] shadow">
            <table className="min-w-full text-sm bg-white rounded-lg">
              <thead className="bg-[#A78074] text-white text-left">
                <tr>
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[#4A3F35]">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No customers found...
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-[#fefdfc] transition"
                    >
                      <td className="px-5 py-3 font-semibold">
                        {(currentPage - 1) * usersPerPage + index + 1}
                      </td>
                      <td className="px-5 py-3">{user.displayName || "—"}</td>
                      <td className="px-5 py-3">{user.email || "—"}</td>
                      <td className="px-5 py-3">{user.phone || "—"}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setModalOpen(true);
                          }}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 👉 Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? "bg-[#A78074] text-white"
                    : "bg-gray-100 text-[#A78074]"
                }`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 👉 Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-[#A78074]"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-[#A78074]">User Details</h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p><strong>Name:</strong> {selectedUser.displayName || "—"}</p>
              <p><strong>Email:</strong> {selectedUser.email || "—"}</p>
              <p><strong>Phone:</strong> {selectedUser.phone || "—"}</p>
              <p><strong>User ID:</strong> {selectedUser.id}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
