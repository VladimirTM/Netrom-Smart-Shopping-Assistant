import { Box, Divider, Typography } from "@mui/material";

function Products() {
  return (
    <Box sx={{ maxWidth: 860, mx: "auto", px: 3, py: 6 }}>
      <Typography variant="h3" sx={{ color: "primary.dark", mb: 1 }}>
        Products
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Explore our full range of products.
      </Typography>
      <Divider sx={{ borderColor: "divider" }} />
    </Box>
  );
}

export default Products;
