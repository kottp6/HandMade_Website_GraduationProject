import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useMessageNotification from './hooks/useMessageNotification';
import Hero from './Components/Hero/Hero';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import AboutUs from './Components/AboutUs/AboutUs';
import Footer from './Components/Footer/Footer';
import Article from './Components/Article/Article';
import Journal from './Components/Journal/Journal';
import FeaturedProducts from './Components/FeaturedProducts/FeaturedProducts';
import Testimonials from './Components/Testimonials/Testimonials';
import Services from './Components/Services/Services';
import VendorForm from './Components/VendorForm/VendorForm';
import HomeUser from './Components/HomeUser/HomeUser';
import VendorHome from './Components/VendorHome/VendorHome';
import Dashborad from './Components/Dashborad/Dashborad';
import UserFavorite from './Components/UserFavorite/UserFavorite';
import UserCart from './Components/UserCart/UserCart';
import UserProducts from './Components/UserProducts/UserProducts';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import ProductDetail from './Components/UserProducts/ProductDetail';
import VendorProfile from './Components/VendorProfile/VendorProfile';
import CustomerVendorChat from './Components/CustomerVendorChat/CustomerVendorChat';
import VendorChatsPage from './Components/VendorChatsPage/VendorChatsPage';
import ChatRoom from './Components/ChatRoom/ChatRoom';
import VendorAddProducts from './Components/VendorAddProducts/VendorAddProducts';
import VendorFavorite from './Components/VendorFavorite/VendorFavorite';
import VendorCart from './Components/VendorCart/VendorCart';
import VendorProductsApproved from './Components/VendorProductsApproved/VendorProductsApproved';
import VendorProductDetails from './Components/VendorProductDetails/VendorProductDetails';
import Showvendorproduct from './Components/Showvendorproduct/Showvendorproduct';
import VendorChatPage from './Components/VendorChatPage/VendorChatPage.JSX';
import Checkout from './Components/Checkout/Checkout';
import PaymentSuccess from './Components/Success/PaymentSuccess';
import UserOrders from './Components/UserOrders/UserOrders';
import UserOrderDetails from './Components/UserOrderDetails/UserOrderDetails';
import Vendors from './Components/Vendors/Vendors';
import CustomerChats from './Components/CustomerChats/CustomerChats';
import UserProfile from './Components/UserProfile/UserProfile';
import FeedbackForm from './Components/FeedbackForm/FeedbackForm';

function App() {
useMessageNotification();
  return (
    <>
      
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<Article />} />
        <Route path="/products" element={<FeaturedProducts />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendorform" element={<VendorForm />} />
        <Route path="/homeuser" element={<HomeUser />} />
        <Route path="/userproducts" element={<UserProducts />} />
        <Route path="/userproducts/:id" element={<ProductDetails />} />
        <Route path="/userfavorite" element={<UserFavorite />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/userorders" element={<UserOrders />} />
        <Route path="/orders/:orderId" element={<UserOrderDetails />} />
        <Route path="/feedback/:orderId/:productId" element={<FeedbackForm />} />
        <Route path='/vendors' element={<Vendors/>} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/customerchats" element={<CustomerChats />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/vendors/:vendorId" element={<VendorProfile />} />
        <Route path="/chat/:chatId" element={<CustomerVendorChat />} />
        <Route path="/chat/:chatId" element={<ChatRoom />} />
        <Route path="/vendor/chats" element={<VendorChatsPage />} />
        <Route path="/vendor/chat/:chatId" element={<VendorChatPage />} />
          {/* <Route path="/vendor/addproduct" element={<VendorAddProducts />} />        */}
        <Route path="/vendor/favorites" element={<VendorFavorite />} />
        <Route path="/vendor/cart" element={<VendorCart />} />
        <Route path="/vendor/approvedproduct" element={<VendorProductsApproved />} />
        <Route path="/cart" element={<UserCart />} />
        <Route path="/vendorhome" element={<VendorHome />} />
        <Route path="/vendorproduct/:id" element={<VendorProductDetails />} />
        
        <Route path='/vendor/showvendorproduct' element={<Showvendorproduct />} />
        <Route path='/dashboard' element={<Dashborad />} />
        {/* Optional: add 404 route */}
        <Route path="*" element={<div className="text-center py-10 text-2xl">404 - Page Not Found</div>} />
      </Routes>
      <Footer />
      <Toaster position="top-center" />
   </>
  );
}

export default App;
