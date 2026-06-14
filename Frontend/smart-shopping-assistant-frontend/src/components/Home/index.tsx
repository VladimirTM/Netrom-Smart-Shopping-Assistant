import { Box, Button, Chip, Container, Grid, IconButton, Paper, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InventoryIcon from "@mui/icons-material/Inventory";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "../../context/AuthContext/auth-context";
import ActivityLog from "../ActivityLog";
import type { Banner } from "../shared/types/Banner";

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
  {
    icon: <ViewCarouselIcon sx={{ fontSize: 36 }} />,
    title: "Banners",
    description: "Create and manage promotional banners shown on the home page.",
    to: "/banners",
    cta: "Manage Banners",
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 36 }} />,
    title: "Analytics",
    description: "View cart activity, estimated revenue and top products at a glance.",
    to: "/analytics",
    cta: "View Analytics",
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

function BannerCarousel({ banners }: { banners: Banner[] }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    let id: ReturnType<typeof setInterval>;

    function start() {
      id = setInterval(() => setCurrent((i) => (i + 1) % banners.length), 5000);
    }
    function handleVisibility() {
      clearInterval(id);
      if (document.visibilityState === "visible") start();
    }

    start();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [banners.length]);

  const prev = () => setCurrent((i) => (i - 1 + banners.length) % banners.length);
  const next = () => setCurrent((i) => (i + 1) % banners.length);

  return (
    <Box sx={{ position: "relative", overflow: "hidden", height: { xs: 300, sm: 400, md: 520 } }}>
      {banners.map((banner, i) => (
        <Box
          key={banner.id}
          component={banner.linkTo ? "a" : "div"}
          href={banner.linkTo ?? undefined}
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textDecoration: "none",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.03)",
            zIndex: i === current ? 1 : 0,
            cursor: banner.linkTo ? "pointer" : "default",
            ...(banner.imageUrl
              ? { background: `url(${banner.imageUrl}) center/cover no-repeat` }
              : {
                  background: isDark
                    ? "linear-gradient(135deg, #3a2e00 0%, #5a4800 50%, #6e5800 100%)"
                    : "linear-gradient(135deg, #5a4a00 0%, #867000 50%, #a08800 100%)",
                }),
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: banner.imageUrl
                ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.60) 50%, rgba(0,0,0,0.45) 100%)"
                : "rgba(0,0,0,0.35)",
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              px: { xs: 3, md: 8 },
              maxWidth: 760,
              color: "#fff",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 1.5,
                fontSize: { xs: "2rem", sm: "2.9rem", md: "3.75rem" },
                lineHeight: 1.1,
                textShadow: "0 4px 24px rgba(0,0,0,0.7), 0 1px 0 rgba(0,0,0,0.5)",
                letterSpacing: "-0.5px",
              }}
            >
              {banner.title}
            </Typography>
            {banner.subtitle && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  opacity: 1,
                  mb: banner.linkTo ? 3 : 0,
                  textShadow: "0 2px 12px rgba(0,0,0,0.65)",
                  fontSize: { xs: "1.05rem", md: "1.35rem" },
                }}
              >
                {banner.subtitle}
              </Typography>
            )}
            {banner.linkTo && (
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "#fff",
                  color: "primary.dark",
                  fontWeight: 700,
                  px: 5,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                  "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.88)" : "#f5f0cc" },
                }}
              >
                Shop Now
              </Button>
            )}
          </Box>
        </Box>
      ))}

      {banners.length > 1 && (
        <>
          <IconButton
            onClick={(e) => { e.preventDefault(); prev(); }}
            size="large"
            sx={{
              position: "absolute",
              left: { xs: 8, md: 20 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.18)",
              color: "#fff",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.32)" },
            }}
          >
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <IconButton
            onClick={(e) => { e.preventDefault(); next(); }}
            size="large"
            sx={{
              position: "absolute",
              right: { xs: 8, md: 20 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.18)",
              color: "#fff",
              backdropFilter: "blur(4px)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.32)" },
            }}
          >
            <ChevronRightIcon fontSize="large" />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 1,
              zIndex: 2,
            }}
          >
            {banners.map((_, i) => (
              <Box
                key={i}
                onClick={() => setCurrent(i)}
                sx={{
                  width: i === current ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "#fff",
                  opacity: i === current ? 1 : 0.45,
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}

function StaticHero() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box
      sx={{
        background: isDark
          ? "linear-gradient(135deg, #3a2e00 0%, #5a4800 50%, #6e5800 100%)"
          : "linear-gradient(135deg, #5a4a00 0%, #867000 50%, #a08800 100%)",
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
          "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.85)" : "#f5f0cc" },
        }}
      >
        Start Shopping
      </Button>
    </Box>
  );
}

function UserHome() {
  const [activeBanners, setActiveBanners] = useState<Banner[]>([]);

  useEffect(() => {
    import("../../api/clients/BannerApiClient")
      .then(({ bannersApi }) => bannersApi.getAll(true))
      .then(setActiveBanners)
      .catch(() => {});
  }, []);

  return (
    <Box>
      {activeBanners.length > 0 ? (
        <BannerCarousel banners={activeBanners} />
      ) : (
        <StaticHero />
      )}

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 4,
            p: { xs: 4, md: 6 },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
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
                      "& .MuiSvgIcon-root": { color: "#1a1a00", fontSize: 22 },
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

      <Box sx={{ mt: 5 }}>
        <ActivityLog />
      </Box>
    </Container>
  );
}

function Home() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminHome /> : <UserHome />;
}

export default Home;
