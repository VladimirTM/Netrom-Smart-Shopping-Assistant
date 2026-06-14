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
  IconButton,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productsApi } from "../../api/clients/ProductApiClient";
import type { Product } from "../shared/types/Product";
import { useCart } from "../../context/CartContent/cart-context";
import { useWishlist } from "../../context/WishlistContext/wishlist-context";
import { useToast } from "../../context/ToastContext/toast-context";
import { useAuth } from "../../context/AuthContext/auth-context";
import { fmt } from "../../utils/currency";

function Wishlist() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { items, toggle } = useWishlist();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    if (items.size === 0) {
      setLoading(false);
      return;
    }
    productsApi.getAll()
      .then(setProducts)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [items]);

  const visibleProducts = products.filter((p) => items.has(p.id));

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <FavoriteIcon color="error" />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Wishlist
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {visibleProducts.length} item{visibleProducts.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : visibleProducts.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <FavoriteIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
            Browse the shop and heart the items you love.
          </Typography>
          <Button variant="contained" onClick={() => navigate("/shop")}>
            Go to Shop
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}
        >
          {visibleProducts.map((product) => (
            <Card
              key={product.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": { boxShadow: 4, transform: "translateY(-2px)" },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={product.imageUrl || `https://placehold.co/400x150/eeeeee/999999?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  sx={{ objectFit: "cover", cursor: "pointer" }}
                  onClick={() => navigate(`/shop/${product.id}`)}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.src = `https://placehold.co/400x150/eeeeee/999999?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => { void toggle(product.id); showToast("Removed from wishlist", "info"); }}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "background.paper" },
                    boxShadow: 1,
                    p: 0.5,
                  }}
                >
                  <DeleteOutlinedIcon fontSize="small" color="error" />
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5, cursor: "pointer", "&:hover": { color: "primary.main" } }}
                  onClick={() => navigate(`/shop/${product.id}`)}
                >
                  {product.name}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                  {product.categories.map((c) => (
                    <Chip key={c.id} label={c.name} size="small" sx={{ height: 18, fontSize: "0.68rem" }} />
                  ))}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.dark" }}>
                    {fmt(product.price)}
                  </Typography>
                  {product.stockQuantity === 0 && (
                    <Chip label="Out of stock" size="small" color="error" sx={{ height: 18, fontSize: "0.68rem" }} />
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  startIcon={addingId === product.id ? <CircularProgress size={14} color="inherit" /> : <AddShoppingCartIcon fontSize="small" />}
                  disabled={product.stockQuantity === 0 || addingId === product.id}
                  onClick={async () => {
                    if (!isAuthenticated) { navigate("/login"); return; }
                    if (addingId !== null) return;
                    setAddingId(product.id);
                    try {
                      await addItem(product.id, 1);
                      showToast(`${product.name} added to cart`);
                    } finally {
                      setAddingId(null);
                    }
                  }}
                >
                  {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default Wishlist;
