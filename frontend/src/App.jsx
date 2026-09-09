import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { CartProvider } from './features/orders/CartContext';
import AdminRoute from './features/admin/components/AdminRoute';

import Home from './pages/Home';
import Signup from './features/auth/pages/Signup';
import Login from './features/auth/pages/Login';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import ChangePassword from './features/auth/pages/ChangePassword';
import SellerUpload from './features/verification/pages/SellerUploads';
import PostGig from './features/products/pages/PostGig';
import Cart from './features/orders/pages/Cart';
import Checkout from './features/orders/pages/Checkout';
import ProductDetail from './features/products/pages/ProductDetail';
import OrderHistory from './features/orders/pages/OrderHistory';
import SellerOrders from './features/orders/pages/SellerOrders';

import AdminOverview from './features/admin/pages/AdminOverview';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import AdminProducts from './features/admin/pages/AdminProducts';
import AdminUsers from './features/admin/pages/AdminUsers';
import AdminSettings from './features/admin/pages/AdminSettings';
import AdminHelp from './features/admin/pages/AdminHelp';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
            <Route path="/admin/verifications" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/vendors" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/help" element={<AdminRoute><AdminHelp /></AdminRoute>} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/seller/orders" element={<SellerOrders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/post-gig" element={<PostGig />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/become-seller" element={<SellerUpload />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;