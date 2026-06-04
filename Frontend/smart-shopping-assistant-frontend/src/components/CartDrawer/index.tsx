import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../../context/CartContent/cart-context";

const fmt = (value: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(value);

function CartDrawer() {
  const { cart, open, closeCart, updateQuantity, removeProduct } = useCart();

  const isEmpty = cart === null || cart.items.length === 0;
  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

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

        {isEmpty ? (
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
            <Typography variant="body2" color="text.disabled" sx={{ textAlign: "center" }}>
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
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
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
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 1.5, minWidth: 20, textAlign: "center", fontWeight: 500 }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography sx={{ fontWeight: 600 }}>{fmt(item.subtotal)}</Typography>
                  </Box>
                  <Divider sx={{ mt: 1.5 }} />
                </ListItem>
              ))}
            </List>

            {/* Summary & Checkout */}
            <Box sx={{ px: 2.5, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>{fmt(cart.subtotal)}</Typography>
              </Box>
              {cart.appliedPromotions.map((promotion) => (
                <Box
                  key={promotion.promotionName}
                  sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}
                >
                  <Typography color="success.main" variant="body2">
                    {promotion.promotionName}
                  </Typography>
                  <Typography color="success.main" variant="body2">
                    -{fmt(Math.abs(promotion.discount))}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {fmt(cart.total)}
                </Typography>
              </Box>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                sx={{ borderRadius: 2 }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}

export default CartDrawer;
