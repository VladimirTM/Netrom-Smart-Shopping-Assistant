import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useCart } from "../../context/CartContent/cart-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyzeDialog from "./AnalyzeDialog";
import { fmt } from "../../utils/currency";

function CartDrawer() {
  const { cart, cartError, open, closeCart, updateQuantity, removeProduct } = useCart();
  const navigate = useNavigate();

  const isEmpty = cart === null || cart.items.length === 0;
  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [inputQty, setInputQty] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!cart) return;
    setInputQty(() => {
      const next: Record<number, string> = {};
      cart.items.forEach((item) => { next[item.id] = String(item.quantity); });
      return next;
    });
  }, [cart]);

  function commitQty(id: number, currentQty: number, maxQty: number) {
    const raw = inputQty[id] ?? "";
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed < 1) {
      setInputQty((prev) => ({ ...prev, [id]: String(currentQty) }));
      return;
    }
    const clamped = Math.min(parsed, maxQty);
    if (clamped !== currentQty) {
      updateQuantity(id, clamped);
    }
    setInputQty((prev) => ({ ...prev, [id]: String(clamped) }));
  }

  return (
    <Drawer anchor="right" open={open} onClose={closeCart}>
      <Box
        sx={{
          width: { xs: "100vw", sm: 420 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2.5,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingCartIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Your Cart
            </Typography>
            {itemCount > 0 && (
              <Typography
                variant="body2"
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderRadius: "12px",
                  px: 1,
                  py: 0.25,
                  fontWeight: 600,
                  lineHeight: 1.5,
                }}
              >
                {itemCount}
              </Typography>
            )}
          </Box>
          <IconButton onClick={closeCart} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {cartError !== null ? (
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Alert severity="error">{cartError}</Alert>
          </Box>
        ) : isEmpty ? (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              color: "text.secondary",
              px: 3,
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: 64, opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary">
              Your cart is empty
            </Typography>
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ textAlign: "center" }}
            >
              Add products from the shop to get started.
            </Typography>
            <Button variant="outlined" onClick={closeCart} sx={{ mt: 1 }}>
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflowY: "auto", px: 1 }}>
              {cart.items.map((item) => (
                <ListItem
                  key={item.id}
                  disableGutters
                  sx={{ display: "block", py: 1.5, px: 1.5 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, lineHeight: 1.3 }}>
                      {item.productName}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeProduct(item.id)}
                      sx={{ flexShrink: 0, mt: -0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.25 }}
                  >
                    {fmt(item.price)} each
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <TextField
                        size="small"
                        type="number"
                        value={inputQty[item.id] ?? item.quantity}
                        onChange={(e) =>
                          setInputQty((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        onBlur={() => commitQty(item.id, item.quantity, item.stockQuantity)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitQty(item.id, item.quantity, item.stockQuantity);
                        }}
                        slotProps={{
                          htmlInput: {
                            min: 1,
                            max: item.stockQuantity,
                            style: { textAlign: "center", padding: "4px 2px" },
                          },
                        }}
                        sx={{
                          width: 56,
                          mx: 0.5,
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none" },
                          "& input[type=number]": { MozAppearance: "textfield" },
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stockQuantity}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontWeight: 600 }}>
                      {fmt(item.subtotal)}
                    </Typography>
                  </Box>
                  <Divider sx={{ mt: 1.5 }} />
                </ListItem>
              ))}
            </List>

            {/* Summary & Checkout */}
            <Box
              sx={{
                px: 2.5,
                py: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.75,
                }}
              >
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>{fmt(cart.subtotal)}</Typography>
              </Box>
              {cart.appliedPromotions.map((promotion) => (
                <Box
                  key={promotion.promotionId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.75,
                  }}
                >
                  <Typography color="success.main" variant="body2">
                    {promotion.promotionName}
                  </Typography>
                  <Typography color="success.main" variant="body2">
                    -{fmt(promotion.discount)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1.5 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {fmt(cart.total)}
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<AutoAwesomeIcon />}
                  sx={{ borderRadius: 2 }}
                  onClick={() => setAnalyzeOpen(true)}
                >
                  AI Analyze
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  sx={{ borderRadius: 2 }}
                  onClick={() => { closeCart(); navigate("/checkout"); }}
                >
                  Proceed to Checkout
                </Button>
              </Stack>
            </Box>
          </>
        )}
      </Box>
      {analyzeOpen && <AnalyzeDialog onClose={() => setAnalyzeOpen(false)} />}
    </Drawer>
  );
}

export default CartDrawer;
