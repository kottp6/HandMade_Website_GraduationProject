import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaComments } from "react-icons/fa";
import UserNavbar from "../UserNavbar/UserNavbar";

export default function VendorProfile() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const vendorRef = doc(db, "Vendors", vendorId);
        const vendorSnap = await getDoc(vendorRef);
        if (vendorSnap.exists()) {
          setVendor(vendorSnap.data());
        } else {
          console.error("Vendor not found");
        }
      } catch (err) {
        console.error("Failed to fetch vendor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [vendorId]);

  if (loading) return <div className="text-center py-10 text-[#A78074]">Loading vendor profile...</div>;
  if (!vendor) return <div className="text-center py-10 text-red-500">Vendor not found</div>;

  return (
   <>
   <UserNavbar></UserNavbar>
     <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={vendor.avatar || `https://ui-avatars.com/api/?name=${vendor.firstName}+${vendor.lastName}&background=A78074&color=fff`}
            alt={`${vendor.firstName} ${vendor.lastName}`}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#A78074]"
          />
        </div>

        {/* Vendor Info */}
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-[#A78074] mb-2">
            {vendor.firstName} {vendor.lastName}
          </h1>

          <div className="text-gray-700 space-y-2 text-sm md:text-base">
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-[#A78074]" /> {vendor.email || "No email"}
            </p>
            <p className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#A78074]" /> {vendor.phone || "No phone"}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#A78074]" /> {vendor.address || "No address"}
            </p>
          </div>

          <p className="mt-4 text-gray-600">
            {vendor.bio || "No bio available for this vendor."}
          </p>

          {/* Chat Button */}
          <button
            className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-[#A78074] text-white rounded-full hover:bg-[#8c6152] transition"
            onClick={() => alert("Redirect to chat feature or modal")}
          >
            <FaComments /> Chat with Vendor
          </button>
        </div>
      </div>
    </div>
   </>
  );
}
