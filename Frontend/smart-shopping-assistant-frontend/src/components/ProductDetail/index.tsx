import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsApi } from "../../api/clients/ProductApiClient";
import type { Product } from "../shared/types/Product";
import { useCart } from "../../context/CartContent/cart-context";
import { useWishlist } from "../../context/WishlistContext/wishlist-context";
import { useToast } from "../../context/ToastContext/toast-context";
import { useAuth } from "../../context/AuthContext/auth-context";
import { fmt } from "../../utils/currency";

function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, cart } = useCart();
  const { toggle: toggleWishlist, has: isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [qtyInput, setQtyInput] = useState("1");

  const id = Number(productId);

  useEffect(() => {
    if (isNaN(id)) {
      setError("Invalid product ID.");
      setLoading(false);
      return;
    }
    Promise.all([productsApi.getById(id), productsApi.getRelated(id)])
      .then(([prod, rel]) => {
        setProduct(prod);
        setRelated(rel);
        setQuantity(1);
        setQtyInput("1");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  // Clamp selected quantity whenever in-cart stock changes
  useEffect(() => {
    if (!product) return;
    const inCart = cart?.items.find((i) => i.productId === product.id)?.quantity ?? 0;
    const avail = Math.max(0, product.stockQuantity - inCart);
    setQuantity((prev) => {
      const next = Math.min(prev, Math.max(1, avail));
      if (next !== prev) setQtyInput(String(next));
      return next;
    });
  }, [cart, product?.id, product?.stockQuantity]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Product not found."}</Alert>
      </Container>
    );
  }

  const cartQty = cart?.items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const effectiveStock = Math.max(0, product.stockQuantity - cartQty);
  const outOfStock = product.stockQuantity === 0;
  const maxInCart = !outOfStock && effectiveStock === 0;
  const lowStock = effectiveStock > 0 && effectiveStock < 5;

  function commitQtyInput() {
    const parsed = parseInt(qtyInput, 10);
    if (isNaN(parsed) || parsed < 1) { setQtyInput(String(quantity)); return; }
    const clamped = Math.min(parsed, effectiveStock);
    setQuantity(clamped);
    setQtyInput(String(clamped));
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", md: "row" } }}>
        {/* Image */}
        <Box sx={{ flexShrink: 0, width: { xs: "100%", md: 400 } }}>
          <Box
            component="img"
            src={product.imageUrl || `https://placehold.co/400x400/eeeeee/999999?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.src = `https://placehold.co/400x400/eeeeee/999999?text=${encodeURIComponent(product.name)}`;
            }}
            sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxHeight: 400 }}
          />
        </Box>

        {/* Details */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
              {product.name}
            </Typography>
            {!isAdmin && (
              <IconButton
                onClick={() => {
                  if (!isAuthenticated) { navigate("/login"); return; }
                  const wasWishlisted = isWishlisted(product.id);
                  void toggleWishlist(product.id);
                  showToast(wasWishlisted ? "Removed from wishlist" : "Saved to wishlist", wasWishlisted ? "info" : "success");
                }}
                sx={{ flexShrink: 0 }}
              >
                {isWishlisted(product.id) ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1.5 }}>
            {product.categories.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                size="small"
                onClick={() => navigate(`/shop?category=${c.id}`)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, color: "primary.dark", mt: 2 }}>
            {fmt(product.price)}
          </Typography>

          {outOfStock && (
            <Chip label="Out of Stock" color="error" sx={{ mt: 1 }} />
          )}
          {maxInCart && (
            <Chip label="You have all available stock in your cart" color="warning" sx={{ mt: 1 }} />
          )}
          {lowStock && (
            <Chip label={`Only ${effectiveStock} more available`} color="warning" sx={{ mt: 1 }} />
          )}
          {!outOfStock && !maxInCart && !lowStock && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 500 }}>
              In stock ({effectiveStock} available)
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {product.description || "No description available."}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Quantity + Add to Cart */}
          {!isAdmin && <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                onClick={() => {
                  const next = Math.max(1, quantity - 1);
                  setQuantity(next);
                  setQtyInput(String(next));
                }}
                disabled={quantity <= 1}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <TextField
                size="small"
                type="number"
                value={qtyInput}
                onChange={(e) => setQtyInput(e.target.value)}
                onBlur={commitQtyInput}
                onKeyDown={(e) => { if (e.key === "Enter") commitQtyInput(); }}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: effectiveStock,
                    style: { textAlign: "center", padding: "4px 2px" },
                  },
                }}
                sx={{
                  width: 64,
                  mx: 0.5,
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none" },
                  "& input[type=number]": { MozAppearance: "textfield" },
                }}
              />
              <IconButton
                size="small"
                onClick={() => {
                  const next = Math.min(effectiveStock, quantity + 1);
                  setQuantity(next);
                  setQtyInput(String(next));
                }}
                disabled={outOfStock || maxInCart || quantity >= effectiveStock}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCartIcon />}
              disabled={outOfStock || maxInCart}
              onClick={async () => {
                if (!isAuthenticated) { navigate("/login"); return; }
                const parsed = parseInt(qtyInput, 10);
                const qtyToAdd = (!isNaN(parsed) && parsed >= 1)
                  ? Math.min(parsed, effectiveStock)
                  : quantity;
                commitQtyInput();
                try {
                  await addItem(product.id, qtyToAdd);
                  showToast(`${product.name} added to cart`);
                } catch {
                  showToast("Failed to add item to cart.", "error");
                }
              }}
              sx={{ flexGrow: 1 }}
            >
              {outOfStock ? "Out of Stock" : maxInCart ? "Max in Cart" : "Add to Cart"}
            </Button>
          </Box>}
        </Box>
      </Box>

      {/* Related products */}
      {related.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Related Products
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              overflowX: "auto",
              pb: 1,
            }}
          >
            {related.map((rel) => (
              <Card
                key={rel.id}
                sx={{
                  minWidth: 200,
                  maxWidth: 220,
                  flexShrink: 0,
                  cursor: "pointer",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
                }}
                onClick={() => navigate(`/shop/${rel.id}`)}
              >
                <CardMedia
                  component="img"
                  height="130"
                  image={rel.imageUrl || `https://placehold.co/400x130/eeeeee/999999?text=${encodeURIComponent(rel.name)}`}
                  alt={rel.name}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.src = `https://placehold.co/400x130/eeeeee/999999?text=${encodeURIComponent(rel.name)}`;
                  }}
                />
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                    {rel.name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.dark", mt: 0.5 }}>
                    {fmt(rel.price)}
                  </Typography>
                </CardContent>
                {!isAdmin && (
                  <CardActions sx={{ pt: 0, px: 1.5, pb: 1.5 }}>
                    <Button
                      fullWidth
                      size="small"
                      variant="outlined"
                      startIcon={<AddShoppingCartIcon fontSize="small" />}
                      disabled={rel.stockQuantity === 0}
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) { navigate("/login"); return; }
                        try {
                          await addItem(rel.id, 1);
                          showToast(`${rel.name} added to cart`);
                        } catch {
                          showToast("Failed to add item to cart.", "error");
                        }
                      }}
                    >
                      {rel.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </CardActions>
                )}
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default ProductDetail;
