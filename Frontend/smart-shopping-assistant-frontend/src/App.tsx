import { Box } from "@mui/material";
import "./App.css";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Promotions from "./components/Promotions";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Box className="app">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;
