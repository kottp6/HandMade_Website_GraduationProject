import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import logo from "../../assets/logo.png";

export default function UserNavbar() {
  const [userName, setUserName] = useState("User");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [hasNewMessages, setHasNewMessages] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserName(data.displayName || "User");
        }
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
  
    const chatsQuery = query(
      collection(db, "chats"),
      where("customerId", "==", user.uid)
    );
  
    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      snapshot.forEach((chatDoc) => {
        const chatId = chatDoc.id;
        const messagesRef = collection(db, "chats", chatId, "messages");
  
        const msgQuery = query(messagesRef, orderBy("createdAt", "desc"));
  
        onSnapshot(msgQuery, (msgSnap) => {
          const latest = msgSnap.docs[0]?.data();
          if (
            latest &&
            latest.senderId !== user.uid &&
            latest.createdAt?.seconds > (Date.now() / 1000) - 5
          ) {
            setHasNewMessages(true);
          }
        });
      });
    });
  
    return () => unsubscribe();
  }, []);
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(collection(db, "Cart"), where("userId", "==", user.uid));
        const unsubscribeCart = onSnapshot(q, (snapshot) => {
          setCartCount(snapshot.size);
        });
        return unsubscribeCart;
      } else {
        setCartCount(0);
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        {/* Right: Logo */}
        <div className="flex items-center space-x-2">
          <NavLink to="/">
            <img src={logo} alt="Hand Made Logo" className="w-16 h-16" />
          </NavLink>
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex gap-6 mx-auto text-gray-700 font-medium text-sm sm:text-base">
          <Link to="/homeuser" className="hover:text-[#1B8354] transition">Home</Link>
          <Link to="/userproducts" className="hover:text-[#1B8354] transition">Products</Link>

          <div className="relative">
            <Link to="/cart" className="hover:text-[#1B8354] transition">
              Cart
            </Link>
            {cartCount > 0 && (
              <span className="absolute -top-3 -right-5 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          <Link to="/userfavorite" className="hover:text-[#1B8354] transition">Favorites</Link>
          <Link to="/userorders" className="hover:text-[#1B8354] transition">Orders</Link>
          <Link to="/vendors" className='hover:text-[#1B8354] transition'>Vendors</Link>
          <div className="relative">
            <Link to="/customerchats" className="hover:text-[#1B8354] transition">
              Chats
            </Link>
            {hasNewMessages && (
              <span className="absolute -top-2 -right-3 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
        </div>
        </div>

        {/* Left: Welcome + Logout */}
        <div className="flex items-center gap-3 text-sm sm:text-base mt-3 md:mt-0">
          <Link to="/userprofile" className="text-gray-700 font-medium">
            Welcome, <span className="text-[#1B8354]">{userName}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
