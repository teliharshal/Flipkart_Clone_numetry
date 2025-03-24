// import React,{ useEffect,Suspense } from 'react';
// import { useDispatch } from 'react-redux';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import WebFont from 'webfontloader';
// import Footer from './components/Layouts/Footer/Footer';
// import Header from './components/Layouts/Header/Header';
// import Login from './components/User/Login';
// import Register from './components/User/Register';
// import { loadUser } from './actions/userAction';
// import UpdateProfile from './components/User/UpdateProfile';
// import UpdatePassword from './components/User/UpdatePassword';
// import ForgotPassword from './components/User/ForgotPassword';
// import ResetPassword from './components/User/ResetPassword';
// import Account from './components/User/Account';
// import ProtectedRoute from './Routes/ProtectedRoute';
// import Home from './components/Home/Home';
// import ProductDetails from './components/ProductDetails/ProductDetails';
// import Products from './components/Products/Products';
// import Cart from './components/Cart/Cart';
// import Shipping from './components/Cart/Shipping';
// import OrderConfirm from './components/Cart/OrderConfirm';
// import Payment from './components/Cart/Payment';
// import OrderStatus from './components/Cart/OrderStatus';
// import OrderSuccess from './components/Cart/OrderSuccess';
// import MyOrders from './components/Order/MyOrders';
// import OrderDetails from './components/Order/OrderDetails';
// import Dashboard from './components/Admin/Dashboard';
// import MainData from './components/Admin/MainData';
// import OrderTable from './components/Admin/OrderTable';
// import UpdateOrder from './components/Admin/UpdateOrder';
// import ProductTable from './components/Admin/ProductTable';
// import NewProduct from './components/Admin/NewProduct';
// import UpdateProduct from './components/Admin/UpdateProduct';
// import UserTable from './components/Admin/UserTable';
// import UpdateUser from './components/Admin/UpdateUser';
// import ReviewsTable from './components/Admin/ReviewsTable';
// import Wishlist from './components/Wishlist/Wishlist';
// import NotFound from './components/NotFound';

import React, { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';
import WebFont from 'webfontloader';
import { loadUser } from './actions/userAction';

const Footer = React.lazy(() => import('./components/Layouts/Footer/Footer'));
const Header = React.lazy(() => import('./components/Layouts/Header/Header'));
const Login = React.lazy(() => import('./components/User/Login'));
const Register = React.lazy(() => import('./components/User/Register'));
const Home = React.lazy(() => import('./components/Home/Home'));
const ProductDetails = React.lazy(() => import('./components/ProductDetails/ProductDetails'));
const Products = React.lazy(() => import('./components/Products/Products'));
const Cart = React.lazy(() => import('./components/Cart/Cart'));
const Wishlist = React.lazy(() => import('./components/Wishlist/Wishlist'));
const NotFound = React.lazy(() => import('./components/NotFound'));

// Admin Components
const AdminDashboard = React.lazy(() => import('./components/Admin/AdminDashboard'));
const ManageProducts = React.lazy(() => import('./components/Admin/ManageProducts'));

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    WebFont.load({
      google: { families: ["Roboto:300,400,500,600,700"] }
    });
  }, []);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
      </Suspense>

      <Routes>
        <Route path="/" element={<Suspense fallback={<div>Loading...</div>}><Home /></Suspense>} />
        <Route path="/login" element={<Suspense fallback={<div>Loading...</div>}><Login /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<div>Loading...</div>}><Register /></Suspense>} />
        <Route path="/product/:id" element={<Suspense fallback={<div>Loading...</div>}><ProductDetails /></Suspense>} />
        <Route path="/products" element={<Suspense fallback={<div>Loading...</div>}><Products /></Suspense>} />
        <Route path="/cart" element={<Suspense fallback={<div>Loading...</div>}><Cart /></Suspense>} />
        <Route path="/wishlist" element={<Suspense fallback={<div>Loading...</div>}><Wishlist /></Suspense>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Suspense fallback={<div>Loading...</div>}><AdminDashboard /></Suspense>} />
        <Route path="/admin/products" element={<Suspense fallback={<div>Loading...</div>}><ManageProducts /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<div>Loading...</div>}><NotFound /></Suspense>} />
      </Routes>

      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
