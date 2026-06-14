import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { adminOrdersApi } from "../../api/clients/OrderApiClient";
import type { AdminOrderModel } from "../../api/models/OrderModel";
import { useToast } from "../../context/ToastContext/toast-context";
import { fmt } from "../../utils/currency";

const ORDER_STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, "warning" | "info" | "primary" | "success" | "error" | "default"> = {
  Pending: "warning",
  Confirmed: "info",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "error",
};

function ManageOrders() {
  const [orders, setOrders] = useState<AdminOrderModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    adminOrdersApi.getAll()
      .then(setOrders)
      .catch((err: Error) => setError(err.message || "Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(orderId: number, status: string) {
    setUpdating(orderId);
    try {
      await adminOrdersApi.updateStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      showToast(`Order #${orderId} status updated to ${status}`, "success");
    } catch {
      showToast("Failed to update order status.", "error");
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Manage Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {!error && orders.length === 0 ? (
        <Typography color="text.secondary">No orders placed yet.</Typography>
      ) : (
        orders.map((order) => (
          <Accordion key={order.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%", flexWrap: "wrap" }}>
                <Typography sx={{ fontWeight: 600 }}>Order #{order.id}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.placedAt).toLocaleDateString("ro-RO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.userEmail}
                </Typography>
                <Chip
                  label={order.status}
                  size="small"
                  color={STATUS_COLORS[order.status] ?? "default"}
                  sx={{ ml: "auto" }}
                />
                <Typography sx={{ fontWeight: 700, mr: 1 }}>{fmt(order.total)}</Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3 }}>
                {/* Items table */}
                <Box sx={{ flex: 1 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Qty</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item) => (
                        <TableRow key={item.productId}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell align="right">{fmt(item.price)}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{fmt(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>

                {/* Shipping + status control */}
                <Box sx={{ minWidth: 240, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                      Shipping Address
                    </Typography>
                    {order.shippingName ? (
                      <>
                        <Typography variant="body2">{order.shippingName}</Typography>
                        <Typography variant="body2" color="text.secondary">{order.shippingAddress}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.shippingCity}, {order.shippingPostalCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">{order.shippingPhone}</Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">Not provided</Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                      Update Status
                    </Typography>
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        label="Status"
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {updating === order.id && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                        <CircularProgress size={14} />
                        <Typography variant="caption" color="text.secondary">Saving…</Typography>
                      </Box>
                    )}
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    disabled={order.status === "Cancelled" || updating === order.id}
                    onClick={() => handleStatusChange(order.id, "Cancelled")}
                  >
                    Cancel Order
                  </Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
}

export default ManageOrders;
