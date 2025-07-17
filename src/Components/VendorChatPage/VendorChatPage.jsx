import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import toast from "react-hot-toast";

export default function VendorChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [customerName, setCustomerName] = useState("Customer");
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomerName = async () => {
      try {
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);
        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          const customerIdFromChat = chatData.customerId;
          setCustomerId(customerIdFromChat);

          const userRef = doc(db, "Users", customerIdFromChat); // Change collection if needed
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setCustomerName(userData.displayName || userData.email || "Customer");
          }
        }
      } catch (err) {
        console.error("Error fetching customer info:", err);
      }
    };

    fetchCustomerName();
  }, [chatId]);

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    const user = auth.currentUser;
    if (!user || !newMessage.trim()) return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        chatId,
        text: newMessage.trim(),
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: newMessage.trim(),
        updatedAt: serverTimestamp(),
      });

      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold mb-4 text-[#A78074]">Chat</h2>

      <div className="bg-white shadow rounded-lg p-4 max-h-[60vh] overflow-y-auto mb-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === auth.currentUser?.uid;
          const isCustomer = msg.senderId === customerId;

          return (
            <div
              key={msg.id}
              className={`mb-4 max-w-[75%] ${
                isCurrentUser ? "ml-auto text-right" : "mr-auto text-left"
              }`}
            >
              {isCustomer && (
                <p className="text-xs text-gray-500 mb-1">{customerName}</p>
              )}
              <div
                className={`p-2 rounded ${
                  isCurrentUser
                    ? "bg-green-100"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-4 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-[#A78074] text-white px-4 py-2 rounded hover:bg-[#8c6f66] transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
