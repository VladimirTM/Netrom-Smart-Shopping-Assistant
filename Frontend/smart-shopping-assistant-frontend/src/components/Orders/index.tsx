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
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ordersApi } from "../../api/clients/OrderApiClient";
import type { OrderModel } from "../../api/models/OrderModel";
import { fmt } from "../../utils/currency";

const STATUS_COLORS: Record<string, "warning" | "info" | "primary" | "success" | "error" | "default"> = {
  Pending: "warning",
  Confirmed: "info",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "error",
};

function Orders() {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    ordersApi.getAll()
      .then(setOrders)
      .catch((err: Error) => setError(err.message || "Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          No orders yet
        </Typography>
        <Button variant="contained" onClick={() => navigate("/shop")} sx={{ mt: 2 }}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Order History
      </Typography>

      {orders.map((order) => (
        <Accordion key={order.id} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
              <Typography sx={{ fontWeight: 600 }}>Order #{order.id}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(order.placedAt).toLocaleDateString("ro-RO", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
              <Chip
                label={order.status}
                size="small"
                color={STATUS_COLORS[order.status] ?? "default"}
                sx={{ ml: "auto", mr: 1 }}
              />
              <Typography sx={{ fontWeight: 700 }}>{fmt(order.total)}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
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
                {order.items.map((item, index) => (
                  <TableRow key={`${item.productId}_${index}`}>
                    <TableCell>
                      <Link href={`/shop/${item.productId}`} underline="hover" color="inherit">
                        {item.productName}
                      </Link>
                    </TableCell>
                    <TableCell align="right">{fmt(item.price)}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{fmt(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {order.appliedPromotions?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Applied Discounts
                </Typography>
                {order.appliedPromotions.map((p) => (
                  <Box key={p.promotionId} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" color="text.secondary">{p.promotionName}</Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      -{fmt(p.discount)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            {order.shippingName && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Shipping Details
                </Typography>
                <Typography variant="body2">{order.shippingName}</Typography>
                <Typography variant="body2" color="text.secondary">{order.shippingAddress}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.shippingCity}, {order.shippingPostalCode}
                </Typography>
                <Typography variant="body2" color="text.secondary">{order.shippingPhone}</Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}

export default Orders;
