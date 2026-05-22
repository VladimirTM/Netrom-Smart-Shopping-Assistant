import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 12,
        px: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: "8rem", fontWeight: 800, color: "primary.light", lineHeight: 1 }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ color: "text.primary" }}>
        Page not found
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", maxWidth: 380 }}
      >
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        size="large"
        sx={{ mt: 2, px: 5 }}
      >
        Go Home
      </Button>
    </Box>
  );
}

export default NotFound;
