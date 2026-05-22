import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

const navItems = [
  { label: "Home", to: "/", end: true },
  { label: "Categories", to: "/categories", end: false },
  { label: "Products", to: "/products", end: false },
  { label: "Promotions", to: "/promotions", end: false },
];

function NavBar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#7A7000",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      <Toolbar sx={{ gap: 0.5 }}>
        <Link to="/">
          <Box
            component="img"
            src={logo}
            alt="Smart Shopping Assistant Logo"
            sx={{ height: 48, mr: 2 }}
          />
        </Link>
        {navItems.map(({ label, to, end }) => (
          <Button
            key={to}
            component={NavLink}
            to={to}
            end={end}
            sx={{
              color: "rgba(255,255,255,0.85)",
              px: 2,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#D4C200",
              },
              "&.active": {
                backgroundColor: "rgba(212,194,0,0.2)",
                color: "#D4C200",
                fontWeight: 700,
              },
            }}
          >
            {label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
