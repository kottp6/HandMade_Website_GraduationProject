import React, { useEffect, useState } from "react";
import PageLayout from "../Components/PageLayout/PageLayout";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Vendors"));
        const vendorList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || null,
          }))
          .filter((user) => user.role === "vendor");

        setVendors(vendorList);
        setFilteredVendors(vendorList);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredVendors(vendors);
    } else {
      const results = vendors.filter(
        (vendor) =>
          vendor.displayName?.toLowerCase().includes(term) ||
          vendor.email?.toLowerCase().includes(term)
      );
      setFilteredVendors(results);
    }
  }, [searchTerm, vendors]);

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <PageLayout title="Vendors">
      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-[#A78074]">All Vendors</h2>
          <input
            type="text"
            placeholder="Search by name or email"
            className="border px-4 py-2 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#A78074]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Vendor Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-[#A78074] text-lg animate-pulse">Loading vendors...</div>
          </div>
        ) : filteredVendors.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No vendors found...</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => {
                  setSelectedVendor(vendor);
                  setModalOpen(true);
                }}
                className="cursor-pointer bg-white p-5 rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition transform hover:-translate-y-1"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#A78074] text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold shadow">
                    {getInitials(vendor.displayName || "NA")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#A78074]">
                      {vendor.displayName || "Unnamed Vendor"}
                    </h3>
                    <p className="text-sm text-gray-600">{vendor.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Registered: {vendor.createdAt?.toLocaleDateString() || "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vendor Modal */}
      {modalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-[#A78074] text-2xl"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#A78074] text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold shadow">
                {getInitials(selectedVendor.displayName || "NA")}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#A78074]">Vendor Details</h2>
                <p className="text-sm text-gray-500">{selectedVendor.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Name:</strong> {selectedVendor.displayName || "—"}</p>
                <p><strong>Phone:</strong> {selectedVendor.phone || "—"}</p>
                <p><strong>Email:</strong> {selectedVendor.email || "—"}</p>
                <p><strong>National ID:</strong> {selectedVendor.nationID || "—"}</p>
                <p><strong>Created At:</strong> {selectedVendor.createdAt?.toLocaleDateString() || "—"}</p>
                <p><strong>Vendor ID:</strong> {selectedVendor.id}</p>
              </div>
              <div>
                <strong>Bio:</strong>
                <p className="mt-1 text-gray-600">{selectedVendor.bio || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
