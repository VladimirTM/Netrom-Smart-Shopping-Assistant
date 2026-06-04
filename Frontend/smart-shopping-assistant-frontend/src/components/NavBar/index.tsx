import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Divider,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import type React from "react";
import { useCart } from "../../context/CartContent/cart-context";
import { useRole } from "../../context/RoleContext/role-context";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const navButtonSx = {
  color: "rgba(255,255,255,0.75)",
  px: 2,
  py: 0.75,
  fontSize: "0.875rem",
  fontWeight: 500,
  borderRadius: 2,
  textTransform: "none",
  letterSpacing: 0,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "#fff",
  },
  "&.active": {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontWeight: 700,
  },
};

function NavBar() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const { cart, openCart } = useCart();

  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: "user" | "admin",
  ) => {
    if (value) {
      setRole(value);
      navigate("/");
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#6B6400",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: 56 }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <Box
            component="img"
            src={logo}
            alt="Smart Shopping Assistant"
            sx={{ height: 40, mr: 1.5 }}
          />
        </Link>

        <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.15)", my: 1 }} />

        {/* Nav links */}
        <Box sx={{ display: "flex", flexGrow: 1, gap: 0.5, ml: 1 }}>
          <Button component={NavLink} to="/" end sx={navButtonSx}>
            Home
          </Button>
          {role === "admin" ? (
            <>
              <Button component={NavLink} to="/categories" sx={navButtonSx}>
                Categories
              </Button>
              <Button component={NavLink} to="/products" sx={navButtonSx}>
                Products
              </Button>
              <Button component={NavLink} to="/promotions" sx={navButtonSx}>
                Promotions
              </Button>
            </>
          ) : (
            <Button component={NavLink} to="/shop" sx={navButtonSx}>
              Shop
            </Button>
          )}
        </Box>

        {/* Role toggle */}
        <ToggleButtonGroup
          value={role}
          exclusive
          size="small"
          onChange={handleModeChange}
          sx={{
            mr: 1.5,
            p: "3px",
            bgcolor: "rgba(0,0,0,0.3)",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.12)",
            "& .MuiToggleButtonGroup-grouped": {
              border: "none !important",
              borderRadius: "7px !important",
            },
            "& .MuiToggleButton-root": {
              color: "rgba(255,255,255,0.45)",
              px: 2.5,
              py: 0.6,
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "none",
              letterSpacing: "0.03em",
              transition: "background 0.15s, color 0.15s",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.75)",
              },
              "&.Mui-selected": {
                bgcolor: "#fff",
                color: "#5a4a00",
                boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                "&:hover": { bgcolor: "#f5f5f5" },
              },
            },
          }}
        >
          <ToggleButton value="user">User</ToggleButton>
          <ToggleButton value="admin">Admin</ToggleButton>
        </ToggleButtonGroup>

        {/* Cart */}
        {role === "user" && (
          <IconButton
            onClick={openCart}
            sx={{
              color: "rgba(255,255,255,0.8)",
              "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <Badge
              badgeContent={cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0}
              color="primary"
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
