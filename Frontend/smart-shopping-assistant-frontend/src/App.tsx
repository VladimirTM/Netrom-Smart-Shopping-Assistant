import { Box } from "@mui/material";
import "./App.css";
import NavBar from "./components/NavBar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Promotions from "./components/Promotions";
import NotFound from "./components/NotFound";
import Shop from "./components/Shop";
import ProductDetail from "./components/ProductDetail";
import Wishlist from "./components/Wishlist";
import CartProvider from "./context/CartContent/CartProvider";
import WishlistProvider from "./context/WishlistContext/WishlistProvider";
import CartDrawer from "./components/CartDrawer";
import AuthProvider from "./context/AuthContext/AuthProvider";
import { useAuth } from "./context/AuthContext/auth-context";
import Login from "./components/Login";
import Register from "./components/Register";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return user?.role === "admin" ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Box className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
          <AppRoutes />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
