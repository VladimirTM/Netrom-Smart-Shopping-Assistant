import { Box } from "@mui/material";
import "./App.css";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Promotions from "./components/Promotions";
import Banners from "./components/Banners";
import Analytics from "./components/Analytics";
import NotFound from "./components/NotFound";
import Shop from "./components/Shop";
import ProductDetail from "./components/ProductDetail";
import Wishlist from "./components/Wishlist";
import CartProvider from "./context/CartContent/CartProvider";
import WishlistProvider from "./context/WishlistContext/WishlistProvider";
import CartDrawer from "./components/CartDrawer";
import AuthProvider from "./context/AuthContext/AuthProvider";
import { useAuth } from "./context/AuthContext/auth-context";
import ToastProvider from "./context/ToastContext/ToastProvider";
import Login from "./components/Login";
import Register from "./components/Register";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import ManageOrders from "./components/ManageOrders";
import ActivityLogPage from "./components/ActivityLogPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === "admin" ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Box className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:productId" element={<ProductDetail />} />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <AdminRoute>
              <Categories />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <AdminRoute>
              <Products />
            </AdminRoute>
          }
        />
        <Route
          path="/promotions"
          element={
            <AdminRoute>
              <Promotions />
            </AdminRoute>
          }
        />
        <Route
          path="/banners"
          element={
            <AdminRoute>
              <Banners />
            </AdminRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <AdminRoute>
              <Analytics />
            </AdminRoute>
          }
        />
        <Route
          path="/manage-orders"
          element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/activity-log"
          element={
            <AdminRoute>
              <ActivityLogPage />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CartDrawer />
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
