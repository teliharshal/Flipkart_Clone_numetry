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

import React, { useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useLocation } from "react-router-dom";
import WebFont from "webfontloader";
import { loadUser } from "./actions/userAction";
import ProtectedRoute from "./components/ProtectedRoute"; // Import Protected Route

const Footer = React.lazy(() => import("./components/Layouts/Footer/Footer"));
const Header = React.lazy(() => import("./components/Layouts/Header/Header"));
const Login = React.lazy(() => import("./components/User/Login"));
const Register = React.lazy(() => import("./components/User/Register"));
const Home = React.lazy(() => import("./components/Home/Home"));
const ProductDetails = React.lazy(() => import("./components/ProductDetails/ProductDetails"));
const Products = React.lazy(() => import("./components/Products/Products"));
const Cart = React.lazy(() => import("./components/Cart/Cart"));
const Wishlist = React.lazy(() => import("./components/Wishlist/Wishlist"));
const NotFound = React.lazy(() => import("./components/NotFound"));

// 🔒 Admin Components
const AdminDashboard = React.lazy(() => import("./components/Admin/AdminDashboard"));
const ManageProducts = React.lazy(() => import("./components/Admin/ManageProducts"));
const ManageOrders = React.lazy(() => import("./components/Admin/ManageOrders"));
const AdminLogin = React.lazy(() => import("./components/Admin/AdminLogin")); // ✅ Added Admin Login
const ManageUsers = React.lazy(() => import("./components/Admin/ManageUsers")); // ✅ Added Manage Users

function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    WebFont.load({
      google: { families: ["Roboto:300,400,500,600,700"] },
    });
  }, []);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <Suspense fallback={<div className="text-center text-xl mt-10">Loading...</div>}>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        {/* 🔐 Admin Login Route */}
        <Route path="/admin-login" element={<AdminLogin />} />  

        {/* 🔒 Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/admin/products" element={<ProtectedRoute element={<ManageProducts />} />} />
        <Route path="/admin/orders" element={<ProtectedRoute element={<ManageOrders />} />} />
        <Route path="/admin/users" element={<ProtectedRoute element={<ManageUsers />} />} />
      
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Suspense>
  );
}

export default App;