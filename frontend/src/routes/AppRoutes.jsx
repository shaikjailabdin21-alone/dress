import { Navigate, Route, Routes } from 'react-router-dom';
import SiteLayout from '../components/layout/SiteLayout.jsx';
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import Home from '../pages/Home.jsx';
import Shop from '../pages/Shop.jsx';
import NewArrivals from '../pages/NewArrivals.jsx';
import FeaturedProducts from '../pages/FeaturedProducts.jsx';
import Collections from '../pages/Collections.jsx';
import ProductDetails from '../pages/ProductDetails.jsx';
import Cart from '../pages/Cart.jsx';
import Search from '../pages/Search.jsx';
import About from '../pages/About.jsx';
import Contact from '../pages/Contact.jsx';
import PrivacyPolicy from '../pages/PrivacyPolicy.jsx';
import TermsConditions from '../pages/TermsConditions.jsx';
import AdminLogin from '../pages/admin/AdminLogin.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';

export default function AppRoutes() {
  return <Routes><Route element={<SiteLayout/>}>
    <Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/>
    <Route path="/new-arrivals" element={<NewArrivals/>}/><Route path="/featured" element={<FeaturedProducts/>}/>
    <Route path="/collections" element={<Collections/>}/><Route path="/product/:slug" element={<ProductDetails/>}/>
    <Route path="/cart" element={<Cart/>}/><Route path="/search" element={<Search/>}/>
    <Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/>
    <Route path="/privacy" element={<PrivacyPolicy/>}/><Route path="/terms" element={<TermsConditions/>}/>
  </Route><Route path="/admin/login" element={<AdminLogin/>}/><Route element={<ProtectedRoute/>}><Route path="/admin" element={<AdminDashboard/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>;
}
