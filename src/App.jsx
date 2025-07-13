import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './Components/Navbar/Navbar';
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
import VendorProfile from './Components/VendorProfile/VendorProfile';

function App() {
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
        <Route path="/vendor/:vendorId" element={<VendorProfile />} />
        <Route path="/favorites" element={<UserFavorite />} />
        <Route path="/cart" element={<UserCart />} />
        <Route path="/homevendor" element={<VendorHome />} />
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
