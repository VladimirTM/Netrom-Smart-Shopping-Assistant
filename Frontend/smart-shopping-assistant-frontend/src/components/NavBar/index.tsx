import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { useCart } from "../../context/CartContent/cart-context";
import { useAuth } from "../../context/AuthContext/auth-context";
import { useWishlist } from "../../context/WishlistContext/wishlist-context";
import { useThemeMode } from "../../context/ThemeContext/theme-context";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

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
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { cart, openCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { mode, toggleMode } = useThemeMode();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  function handleLogout() {
    setMenuAnchor(null);
    logout();
    navigate("/login");
  }

  const isAdmin = user?.role === "admin";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "primary.dark",
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

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderColor: "rgba(255,255,255,0.15)", my: 1 }}
        />

        {/* Nav links */}
        <Box sx={{ display: "flex", flexGrow: 1, gap: 0.5, ml: 1 }}>
          <Button component={NavLink} to="/" end sx={navButtonSx}>
            Home
          </Button>
          {isAdmin ? (
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
              <Button component={NavLink} to="/banners" sx={navButtonSx}>
                Banners
              </Button>
              <Button component={NavLink} to="/analytics" sx={navButtonSx}>
                Analytics
              </Button>
              <Button component={NavLink} to="/manage-orders" sx={navButtonSx}>
                Orders
              </Button>
            </>
          ) : (
            <>
              <Button component={NavLink} to="/shop" sx={navButtonSx}>
                Shop
              </Button>
            </>
          )}
        </Box>

        {/* Wishlist icon — users only */}
        {isAuthenticated && !isAdmin && (
          <Tooltip title="Wishlist">
            <IconButton
              onClick={() => navigate("/wishlist")}
              sx={{
                color: "rgba(255,255,255,0.8)",
                "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <Badge badgeContent={wishlistItems.size} color="error">
                <FavoriteBorderIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        )}

        {/* Cart — users only */}
        {isAuthenticated && !isAdmin && (
          <IconButton
            onClick={openCart}
            sx={{
              color: "rgba(255,255,255,0.8)",
              "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <Badge
              badgeContent={
                cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0
              }
              color="primary"
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        )}

        {/* Dark mode toggle */}
        <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
          <IconButton
            onClick={toggleMode}
            sx={{
              color: "rgba(255,255,255,0.8)",
              "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Auth buttons / avatar */}
        {isAuthenticated ? (
          <>
            <Tooltip title={user?.email ?? ""}>
              <IconButton
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{ p: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "rgba(255,255,255,0.2)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {user?.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {user?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role}
                </Typography>
              </Box>
              <Divider />
              {!isAdmin && (
                <MenuItem onClick={() => { setMenuAnchor(null); navigate("/profile"); }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
              )}
              {!isAdmin && (
                <MenuItem onClick={() => { setMenuAnchor(null); navigate("/orders"); }}>
                  <ListItemIcon>
                    <ReceiptLongIcon fontSize="small" />
                  </ListItemIcon>
                  Order History
                </MenuItem>
              )}
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Sign out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Button
              component={NavLink}
              to="/login"
              startIcon={<LoginIcon />}
              sx={{ ...navButtonSx, px: 1.5 }}
            >
              Sign in
            </Button>
            <Button
              component={NavLink}
              to="/register"
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{
                textTransform: "none",
                bgcolor: "rgba(255,255,255,0.15)",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 2,
                px: 1.5,
                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
