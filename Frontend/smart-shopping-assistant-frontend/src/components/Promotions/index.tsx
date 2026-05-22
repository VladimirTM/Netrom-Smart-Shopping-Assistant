import { Box, Divider, Typography } from "@mui/material";

function Promotions() {
  return (
    <Box sx={{ maxWidth: 860, mx: "auto", px: 3, py: 6 }}>
      <Typography variant="h3" sx={{ color: "primary.dark", mb: 1 }}>
        Promotions
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Today's exclusive deals and offers just for you.
      </Typography>
      <Divider sx={{ borderColor: "divider" }} />
    </Box>
  );
}

export default Promotions;
