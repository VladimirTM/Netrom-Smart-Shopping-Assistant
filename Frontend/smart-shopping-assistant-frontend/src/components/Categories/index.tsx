import { Box, Divider, Typography } from "@mui/material";

function Categories() {
  return (
    <Box sx={{ maxWidth: 860, mx: "auto", px: 3, py: 6 }}>
      <Typography variant="h3" sx={{ color: "primary.dark", mb: 1 }}>
        Categories
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Browse all available product categories.
      </Typography>
      <Divider sx={{ borderColor: "divider" }} />
    </Box>
  );
}

export default Categories;
