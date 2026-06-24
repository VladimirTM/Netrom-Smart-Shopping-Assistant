import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContent/cart-context";
import { useToast } from "../../context/ToastContext/toast-context";
import { ordersApi } from "../../api/clients/OrderApiClient";
import type { ShippingAddressInput } from "../../api/models/OrderModel";
import { fmt } from "../../utils/currency";

const STEPS = ["Review Cart", "Shipping Details", "Confirm Order"];

interface ShippingForm {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

const emptyShipping: ShippingForm = {
  name: "",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
};

function ReviewStep() {
  const { cart, updateQuantity, removeProduct } = useCart();

  if (!cart || cart.items.length === 0) return null;

  return (
    <Paper variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.productName}</TableCell>
              <TableCell align="center">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ minWidth: 24, textAlign: "center" }}>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    disabled={item.quantity >= item.stockQuantity}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell align="right">{fmt(item.price)}</TableCell>
              <TableCell align="right">{fmt(item.subtotal)}</TableCell>
              <TableCell align="right">
                <IconButton size="small" color="error" onClick={() => removeProduct(item.id)}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

interface ShippingStepProps {
  form: ShippingForm;
  onChange: (field: keyof ShippingForm, value: string) => void;
  errors: Partial<ShippingForm>;
}

function ShippingStep({ form, onChange, errors }: ShippingStepProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Full Name"
          fullWidth
          required
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Address"
          fullWidth
          required
          value={form.address}
          onChange={(e) => onChange("address", e.target.value)}
          error={!!errors.address}
          helperText={errors.address}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="City"
          fullWidth
          required
          value={form.city}
          onChange={(e) => onChange("city", e.target.value)}
          error={!!errors.city}
          helperText={errors.city}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Postal Code"
          fullWidth
          required
          value={form.postalCode}
          onChange={(e) => onChange("postalCode", e.target.value)}
          error={!!errors.postalCode}
          helperText={errors.postalCode}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Phone Number"
          fullWidth
          required
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          error={!!errors.phone}
          helperText={errors.phone}
        />
      </Grid>
    </Grid>
  );
}

interface ConfirmStepProps {
  shipping: ShippingForm;
}

function ConfirmStep({ shipping }: ConfirmStepProps) {
  const { cart } = useCart();
  if (!cart) return null;

  const stockWarningItems = cart.items.filter((i) => i.stockQuantity < i.quantity);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {stockWarningItems.length > 0 && (
        <Alert severity="warning">
          Some items may have limited stock since you added them to your cart:{" "}
          {stockWarningItems.map((i) => i.productName).join(", ")}. Please review before placing your order.
        </Alert>
      )}

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Shipping to
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography>{shipping.name}</Typography>
          <Typography color="text.secondary">{shipping.address}</Typography>
          <Typography color="text.secondary">
            {shipping.city}, {shipping.postalCode}
          </Typography>
          <Typography color="text.secondary">{shipping.phone}</Typography>
        </Paper>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Order Summary
        </Typography>
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{fmt(item.subtotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
        {cart.appliedPromotions.map((p) => (
          <Typography key={p.promotionId} color="success.main" variant="body2">
            {p.promotionName}: -{fmt(p.discount)}
          </Typography>
        ))}
        <Divider sx={{ width: "100%", my: 0.5 }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Total: {fmt(cart.total)}
        </Typography>
      </Box>
    </Box>
  );
}

function validateShipping(form: ShippingForm): Partial<ShippingForm> {
  const errors: Partial<ShippingForm> = {};
  if (!form.name.trim()) errors.name = "Required";
  if (!form.address.trim()) errors.address = "Required";
  if (!form.city.trim()) errors.city = "Required";
  if (!form.postalCode.trim()) errors.postalCode = "Required";
  if (!form.phone.trim()) errors.phone = "Required";
  return errors;
}

function Checkout() {
  const { cart, refreshCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [shipping, setShipping] = useState<ShippingForm>(emptyShipping);
  const [shippingErrors, setShippingErrors] = useState<Partial<ShippingForm>>({});
  const [placing, setPlacing] = useState(false);

  const isEmpty = !cart || cart.items.length === 0;

  function handleShippingChange(field: keyof ShippingForm, value: string) {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (shippingErrors[field]) {
      setShippingErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleNext() {
    if (activeStep === 1) {
      const errors = validateShipping(shipping);
      if (Object.keys(errors).length > 0) {
        setShippingErrors(errors);
        return;
      }
    }
    setActiveStep((s) => s + 1);
    window.scrollTo(0, 0);
  }

  function handleBack() {
    setActiveStep((s) => s - 1);
  }

  async function handlePlaceOrder() {
    setPlacing(true);
    try {
      const shippingAddress: ShippingAddressInput = {
        name: shipping.name,
        address: shipping.address,
        city: shipping.city,
        postalCode: shipping.postalCode,
        phone: shipping.phone,
      };
      await ordersApi.place(shippingAddress);
      await refreshCart();
      showToast("Order placed successfully!", "success");
      navigate("/orders");
    } catch (err) {
      showToast((err as Error).message || "Failed to place order. Please try again.", "error");
    } finally {
      setPlacing(false);
    }
  }

  if (isEmpty) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate("/shop")} sx={{ mt: 2 }}>
          Go to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 4 }}>
        {activeStep === 0 && <ReviewStep />}
        {activeStep === 1 && (
          <ShippingStep form={shipping} onChange={handleShippingChange} errors={shippingErrors} />
        )}
        {activeStep === 2 && <ConfirmStep shipping={shipping} />}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>

        {activeStep < STEPS.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isEmpty}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            startIcon={placing ? <CircularProgress size={18} color="inherit" /> : <ShoppingCartCheckoutIcon />}
            disabled={placing}
            onClick={handlePlaceOrder}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {placing ? "Placing order…" : "Place Order"}
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default Checkout;
