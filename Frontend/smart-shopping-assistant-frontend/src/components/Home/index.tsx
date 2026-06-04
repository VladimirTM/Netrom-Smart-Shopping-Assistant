import { Box, Button, Chip, Container, Grid, Paper, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InventoryIcon from "@mui/icons-material/Inventory";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useRole } from "../../context/RoleContext/role-context";

const adminCards = [
  {
    icon: <CategoryIcon sx={{ fontSize: 36 }} />,
    title: "Categories",
    description: "Create, edit and organise product categories to keep the catalogue structured.",
    to: "/categories",
    cta: "Manage Categories",
  },
  {
    icon: <InventoryIcon sx={{ fontSize: 36 }} />,
    title: "Products",
    description: "Add new products, update pricing, descriptions and images across the store.",
    to: "/products",
    cta: "Manage Products",
  },
  {
    icon: <LocalOfferIcon sx={{ fontSize: 36 }} />,
    title: "Promotions",
    description: "Configure quantity deals, cart-total discounts and free-item promotions.",
    to: "/promotions",
    cta: "Manage Promotions",
  },
];

const features = [
  {
    icon: <SmartToyIcon />,
    title: "AI-Powered Cart Analysis",
    description: "Our assistant analyses the cart in real-time and surfaces the best promotions tailored to what shoppers are buying.",
  },
  {
    icon: <TrendingUpIcon />,
    title: "Smart Discount Stacking",
    description: "Automatically combines quantity deals and category discounts to maximise savings at checkout.",
  },
  {
    icon: <AutoAwesomeIcon />,
    title: "Personalised Suggestions",
    description: "Get product recommendations based on cart contents and browsing patterns.",
  },
];

function UserHome() {
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #5a4a00 0%, #867000 50%, #a08800 100%)",
          color: "#fff",
          py: { xs: 8, md: 12 },
          px: 3,
          textAlign: "center",
        }}
      >
        <Chip
          label="AI-Powered Shopping"
          icon={<SmartToyIcon style={{ color: "#fff" }} />}
          sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600 }}
        />
        <Typography
          variant="h2"
          sx={{ fontWeight: 800, mb: 2, fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.2 }}
        >
          Shop Smarter,
          <br />
          Save Automatically
        </Typography>
        <Typography
          variant="h6"
          sx={{ mb: 4, opacity: 0.85, fontWeight: 400, maxWidth: 540, mx: "auto" }}
        >
          Discover thousands of products and let our AI find the best promotions for your cart — automatically.
        </Typography>
        <Button
          component={NavLink}
          to="/shop"
          variant="contained"
          size="large"
          startIcon={<StorefrontIcon />}
          sx={{
            bgcolor: "#fff",
            color: "primary.dark",
            fontWeight: 700,
            px: 5,
            "&:hover": { bgcolor: "#f5f0cc" },
          }}
        >
          Start Shopping
        </Button>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ bgcolor: "#F9F6E8", borderRadius: 4, p: { xs: 4, md: 6 } }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}>
            Why Smart Shopping Assistant?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 5, textAlign: "center" }}>
            Built with AI at its core to help you get the most out of every purchase.
          </Typography>
          <Grid container spacing={4}>
            {features.map(({ icon, title, description }) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "& .MuiSvgIcon-root": { color: "#fff", fontSize: 22 },
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
                  <Typography variant="body2" color="text.secondary">{description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function AdminHome() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
        <AdminPanelSettingsIcon sx={{ fontSize: 36, color: "primary.dark" }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Admin Dashboard
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Manage the store catalogue, product inventory and active promotions.
      </Typography>

      <Grid container spacing={3}>
        {adminCards.map(({ icon, title, description, to, cta }) => (
          <Grid key={title} size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
              }}
            >
              <Box sx={{ color: "primary.dark", mb: 2 }}>{icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 3 }}>
                {description}
              </Typography>
              <Button
                component={NavLink}
                to={to}
                variant="contained"
                sx={{ alignSelf: "flex-start", fontWeight: 600 }}
              >
                {cta}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

function Home() {
  const { role } = useRole();
  return role === "admin" ? <AdminHome /> : <UserHome />;
}

export default Home;
