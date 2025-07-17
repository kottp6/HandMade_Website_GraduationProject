import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import toast from 'react-hot-toast';
import logo from "../../assets/logo.png";
import useVendorNotification from '../../hooks/useVendorNotification';

export default function VendorNavbar() {
  const [displayName, setDisplayName] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const navigate = useNavigate();

  // Get vendor name
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const vendorRef = doc(db, "Vendors", user.uid);
          const vendorSnap = await getDoc(vendorRef);
          const vendorData = vendorSnap.data();

          if (vendorSnap.exists() && vendorData) {
            setDisplayName(vendorData.displayName || "Vendor");
          } else {
            console.warn("Vendor document not found.");
            setDisplayName("Vendor");
          }
        } catch (error) {
          console.error("Error fetching vendor displayName:", error);
          setDisplayName("Vendor");
        }
      } else {
        setDisplayName("");
      }
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  // Listen for new messages
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const chatQuery = query(collection(db, "chats"), where("vendorId", "==", user.uid));
    const unsubscribe = onSnapshot(chatQuery, (chatSnapshot) => {
      chatSnapshot.forEach((chatDoc) => {
        const chatId = chatDoc.id;
        const msgRef = collection(db, "chats", chatId, "messages");
        const msgQuery = query(msgRef, orderBy("createdAt", "desc"));

        onSnapshot(msgQuery, (msgSnapshot) => {
          const latest = msgSnapshot.docs[0]?.data();

          if (
            latest &&
            latest.senderId !== user.uid &&
            latest.createdAt?.seconds > Date.now() / 1000 - 5
          ) {
            setHasNewMessage(true);
          }
        });
      });
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Sign-out error:', error);
      toast.error('Failed to sign out. Try again.');
    }
  };

  useVendorNotification(); // Still used for toast

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <NavLink to="/vendorhome">
            <img src={logo} alt="Hand Made Logo" className="w-16 h-16" />
          </NavLink>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex gap-6 mx-auto text-gray-700 font-medium text-sm sm:text-base">
          <Link to="/vendorhome" className="hover:text-[#1B8354] transition">Home</Link>
          <Link to="/vendor/showvendorproduct" className="hover:text-[#1B8354] transition">Add Products</Link>
          <Link to="/vendor/approvedproduct" className="hover:text-[#1B8354] transition">Approved Products</Link>
          <Link to="/vendor/cart" className="hover:text-[#1B8354] transition">Cart</Link>
          <Link to="/vendor/favorites" className="hover:text-[#1B8354] transition">Favorites</Link>

          <div className="relative">
            <Link to="/vendor/chats" className="hover:text-[#1B8354] transition">Chats</Link>
            {hasNewMessage && (
              <span className="absolute -top-2 -right-3 w-2 h-2 bg-red-500 rounded-full">
                
              </span>
            )}
          </div>
        </div>

        {/* Right: Welcome + Logout */}
        <div className="flex items-center gap-3 text-sm sm:text-base mt-3 md:mt-0">
          <span className="text-gray-700 font-medium">
            Welcome, <span className="text-[#1B8354]">{displayName || "Vendor"}</span>
          </span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
