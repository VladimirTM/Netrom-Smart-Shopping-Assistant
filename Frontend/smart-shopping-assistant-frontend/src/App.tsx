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
import CartProvider from "./context/CartContent/CartProvider";
import CartDrawer from "./components/CartDrawer";
import RoleProvider from "./context/RoleContext/RoleProvider";
import { useRole } from "./context/RoleContext/role-context";

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { role } = useRole();
  return role === "admin" ? <>{children}</> : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Box className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/categories" element={<AdminRoute><Categories /></AdminRoute>} />
        <Route path="/products" element={<AdminRoute><Products /></AdminRoute>} />
        <Route path="/promotions" element={<AdminRoute><Promotions /></AdminRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CartDrawer />
    </Box>
  );
}

function App() {
  return (
    <RoleProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </RoleProvider>
  );
}

export default App;
