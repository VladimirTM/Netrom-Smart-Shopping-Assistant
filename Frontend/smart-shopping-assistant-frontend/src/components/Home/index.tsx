import { Box, Divider, Paper, Typography } from "@mui/material";

const sections = [
  {
    emoji: "🗂️",
    title: "Categories",
    description: "Browse our curated product categories to find exactly what you need.",
  },
  {
    emoji: "🛍️",
    title: "Products",
    description: "Explore a wide range of products with smart suggestions tailored for you.",
  },
  {
    emoji: "🏷️",
    title: "Promotions",
    description: "Check out today's exclusive deals and save more on your shopping.",
  },
];

function Home() {
  return (
    <Box sx={{ maxWidth: 860, mx: "auto", px: 3, py: 6 }}>
      <Typography variant="h3" sx={{ color: "primary.dark", mb: 1 }}>
        Smart Shopping Assistant
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, fontSize: "1.05rem" }}>
        Discover products, categories, and exclusive promotions tailored for you.
      </Typography>

      <Divider sx={{ mb: 4, borderColor: "divider" }} />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 3 }}>
        {sections.map(({ emoji, title, description }) => (
          <Paper
            key={title}
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "#F5F0D0",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" sx={{ mb: 1 }}>{emoji}</Typography>
            <Typography variant="h6" sx={{ color: "primary.dark", mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default Home;
