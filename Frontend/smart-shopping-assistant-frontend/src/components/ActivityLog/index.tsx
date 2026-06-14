import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import HistoryIcon from "@mui/icons-material/History";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEffect, useState } from "react";
import { activityLogApi } from "../../api/clients/ActivityLogApiClient";
import type { ActivityLogModel } from "../../api/models/ActivityLogModel";

const ENTITY_ICONS: Record<string, React.ReactNode> = {
  Category: <CategoryIcon fontSize="small" />,
  Product: <InventoryIcon fontSize="small" />,
  Promotion: <LocalOfferIcon fontSize="small" />,
  Banner: <ViewCarouselIcon fontSize="small" />,
};

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatAction(log: ActivityLogModel): string {
  const verb = log.action
    .replace(log.entityType, "")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase();
  return `${log.entityType} "${log.entityName}" ${verb}`;
}

function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  function loadLogs() {
    activityLogApi
      .getLatest(30)
      .then((data) => {
        setLogs(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const data = await activityLogApi.getLatest(30);
      setLogs(data);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadLogs();
    const interval = setInterval(loadLogs, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: 3 }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <HistoryIcon sx={{ color: "primary.dark" }} />
        <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
          Recent Activity
        </Typography>
        <Tooltip title="Refresh">
          <span>
            <IconButton size="small" onClick={handleRefresh} disabled={refreshing || loading}>
              {refreshing ? <CircularProgress size={16} /> : <RefreshIcon fontSize="small" />}
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      ) : logs.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
          No activity yet. Actions on products, categories, promotions and
          banners will appear here.
        </Typography>
      ) : (
        <List disablePadding>
          {logs.map((log, idx) => (
            <Box key={log.id}>
              <ListItem disableGutters sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 36, color: "primary.dark" }}>
                  {ENTITY_ICONS[log.entityType] ?? (
                    <HistoryIcon fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {formatAction(log)}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {log.actorEmail ? `${log.actorEmail} · ` : ""}
                      {formatRelativeTime(log.occurredAt)}
                    </Typography>
                  }
                />
              </ListItem>
              {idx < logs.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default ActivityLog;
