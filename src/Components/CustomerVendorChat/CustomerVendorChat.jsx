import { useParams } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";
import UserNavbar from "../UserNavbar/UserNavbar";

export default function CustomerVendorChat() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorId, setVendorId] = useState(null);

  const currentUser = auth.currentUser;

  // Fetch vendor info from chat data
  useEffect(() => {
    const fetchChatAndVendor = async () => {
      try {
        const chatDoc = await getDoc(doc(db, "chats", chatId));
        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          setVendorId(chatData.vendorId);

          const vendorDoc = await getDoc(doc(db, "Vendors", chatData.vendorId));
          if (vendorDoc.exists()) {
            setVendorName(vendorDoc.data().displayName || "Vendor");
          }
        }
      } catch (err) {
        console.error("Error fetching vendor info:", err);
      }
    };

    fetchChatAndVendor();
  }, [chatId]);

  // Listen for messages
  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const messageRef = collection(db, "chats", chatId, "messages");
    await addDoc(messageRef, {
      senderId: currentUser.uid,
      text,
      createdAt: serverTimestamp(),
    });

    setText("");
  };

  return (
    <>
      <UserNavbar />
      <div className="max-w-2xl mx-auto p-4">
        <div className="h-[400px] overflow-y-auto border p-4 rounded bg-gray-50">
          {messages.map((msg) => {
            const isVendor = msg.senderId === vendorId;
            const isUser = msg.senderId === currentUser.uid;

            return (
              <div
                key={msg.id}
                className={`mb-4 max-w-[70%] ${
                  isUser ? "ml-auto text-right" : "mr-auto text-left"
                }`}
              >
                {/* Show vendor name above vendor's message */}
                {!isUser && isVendor && (
                  <p className="text-xs text-gray-500 mb-1">{vendorName}</p>
                )}
                <div
                  className={`p-2 rounded ${
                    isUser
                      ? "bg-[#A78074] text-white"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 mt-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border px-3 py-2 rounded"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-[#A78074] text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
