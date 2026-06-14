import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

function PageHeader({ title, actionLabel, onAction }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}

export default PageHeader;
