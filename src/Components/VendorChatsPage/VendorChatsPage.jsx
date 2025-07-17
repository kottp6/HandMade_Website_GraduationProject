import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import VendorNavbar from "../VendorNavbar/VendorNavbar";

export default function VendorChatsPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const vendorId = user.uid;
        console.log("Vendor UID:", vendorId);

        try {
          const q = query(collection(db, "chats"), where("vendorId", "==", vendorId));
          const snapshot = await getDocs(q);
          console.log("Chats found:", snapshot.size);

          const chatData = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
              const data = docSnap.data();
              const customerId = data.customerId;

              if (!customerId) {
                console.warn(`Missing customerId in chat ${docSnap.id}`);
                return null;
              }

              try {
                const customerRef = doc(db, "Users", customerId);
                const customerSnap = await getDoc(customerRef);
                const customer = customerSnap.exists() ? customerSnap.data() : null;

                return {
                  id: docSnap.id,
                  customerName: customer
                    ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                    : "Unknown Customer",
                  lastMessage: data.lastMessage || "No message yet",
                  updatedAt: data.updatedAt?.toDate().toLocaleString() || "Not updated",
                };
              } catch (err) {
                console.error("Failed to get customer:", err);
                return {
                  id: docSnap.id,
                  customerName: "Error loading customer",
                  lastMessage: data.lastMessage || "No message",
                  updatedAt: data.updatedAt?.toDate().toLocaleString() || "Not updated",
                };
              }
            })
          );

          // Filter out null results from Promise.all
          setChats(chatData.filter((c) => c));
        } catch (err) {
          console.error("Error loading chats:", err);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("No authenticated vendor");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenChat = (chatId) => {
    navigate(`/vendor/chat/${chatId}`);
  };

  return (
    <>
    <VendorNavbar></VendorNavbar>
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold text-[#A78074] mb-4">Customer Chats</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : chats.length === 0 ? (
        <p className="text-center text-gray-500">No chats found</p>
      ) : (
        <ul className="space-y-4">
          {chats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => handleOpenChat(chat.id)}
              className="cursor-pointer p-4 bg-white border rounded shadow hover:bg-gray-100"
            >
              <div className="font-semibold text-[#A78074]">{chat.customerName}</div>
              <div className="text-sm text-gray-600">Last: {chat.lastMessage}</div>
              <div className="text-xs text-gray-400">{chat.updatedAt}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );

}
