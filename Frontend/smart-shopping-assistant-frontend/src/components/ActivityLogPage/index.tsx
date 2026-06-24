import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Pagination,
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
import { useEffect, useRef, useState } from "react";
import { activityLogApi } from "../../api/clients/ActivityLogApiClient";
import type { ActivityLogModel } from "../../api/models/ActivityLogModel";

const ENTITY_ICONS: Record<string, React.ReactNode> = {
  Category: <CategoryIcon fontSize="small" />,
  Product: <InventoryIcon fontSize="small" />,
  Promotion: <LocalOfferIcon fontSize="small" />,
  Banner: <ViewCarouselIcon fontSize="small" />,
};

const PAGE_SIZE = 25;

function formatRelativeTime(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

const ACTION_LABELS: Record<string, string> = {
  CategoryCreated: "created",
  CategoryUpdated: "updated",
  CategoryDeleted: "deleted",
  ProductCreated: "created",
  ProductUpdated: "updated",
  ProductDeleted: "deleted",
  PromotionCreated: "created",
  PromotionUpdated: "updated",
  PromotionDeleted: "deleted",
  BannerCreated: "created",
  BannerUpdated: "updated",
  BannerDeleted: "deleted",
};

function formatAction(log: ActivityLogModel): string {
  const verb = ACTION_LABELS[log.action] ?? log.action;
  return `${log.entityType} "${log.entityName}" ${verb}`;
}

function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLogModel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  async function fetchPage(p: number, silent = false) {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const result = await activityLogApi.getPage(PAGE_SIZE, (p - 1) * PAGE_SIZE);
      if (!mountedRef.current) return;
      setLogs(result.logs);
      setTotal(result.total);
      setError("");
    } catch (err) {
      if (mountedRef.current) setError((err as Error).message);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true;
    fetchPage(page);
    return () => { mountedRef.current = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <HistoryIcon sx={{ color: "primary.dark", fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>
          Activity Log
        </Typography>
        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={() => fetchPage(page, true)} disabled={loading || refreshing}>
              {refreshing ? <CircularProgress size={18} /> : <RefreshIcon />}
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : logs.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
            No activity yet.
          </Typography>
        ) : (
          <List disablePadding sx={{ px: 2 }}>
            {logs.map((log, idx) => (
              <Box key={log.id}>
                <ListItem disableGutters sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 36, color: "primary.dark" }}>
                    {ENTITY_ICONS[log.entityType] ?? <HistoryIcon fontSize="small" />}
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

      {pageCount > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            disabled={loading}
          />
        </Box>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 1 }}>
        {total} total events
      </Typography>
    </Container>
  );
}

export default ActivityLogPage;
