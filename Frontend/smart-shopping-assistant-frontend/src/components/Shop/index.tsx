import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productsApi } from "../../api/clients/ProductApiClient";
import { promotionsApi } from "../../api/clients/PromotionApiClient";
import { categoriesApi } from "../../api/clients/CategoryApiClient";
import type { Product } from "../shared/types/Product";
import type { Category } from "../shared/types/Category";
import { useCart } from "../../context/CartContent/cart-context";
import { useWishlist } from "../../context/WishlistContext/wishlist-context";
import { fmt } from "../../utils/currency";

type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotedProductIds, setPromotedProductIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sort, setSort] = useState<SortOption>("price-asc");
  const [onPromotionOnly, setOnPromotionOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { addItem } = useCart();
  const { toggle: toggleWishlist, has: isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get("category");

    Promise.all([productsApi.getAll(), categoriesApi.getAll()])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);

        // Pre-select category from URL param (e.g. navigated from ProductDetail chip)
        if (categoryParam) {
          const catId = parseInt(categoryParam, 10);
          if (!isNaN(catId) && cats.some((c) => c.id === catId)) {
            setSelectedCategories([catId]);
          }
        }

        if (prods.length > 0) {
          const prices = prods.map((p) => p.price);
          setPriceRange([
            Math.floor(Math.min(...prices)),
            Math.ceil(Math.max(...prices)),
          ]);
        }

        // Load promotions separately so their failure never blocks the shop listing
        promotionsApi.getAll().then((promos) => {
          const ids = new Set<number>();
          promos
            .filter((pr) => pr.isActive)
            .forEach((pr) => {
              if (pr.productId != null) ids.add(pr.productId);
              if (pr.categoryId != null) {
                prods
                  .filter((p) => p.categories.some((c) => c.id === pr.categoryId))
                  .forEach((p) => ids.add(p.id));
              }
            });
          setPromotedProductIds(ids);
        }).catch(() => { /* promotions unavailable — filter shows all */ });
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const priceMin = products.length
    ? Math.floor(Math.min(...products.map((p) => p.price)))
    : 0;
  const priceMax = products.length
    ? Math.ceil(Math.max(...products.map((p) => p.price)))
    : 10000;

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const isFiltered =
    selectedCategories.length > 0 ||
    priceRange[0] > priceMin ||
    priceRange[1] < priceMax ||
    onPromotionOnly ||
    inStockOnly;

  function clearFilters() {
    setSelectedCategories([]);
    setPriceRange([priceMin, priceMax]);
    setOnPromotionOnly(false);
    setInStockOnly(false);
  }

  const visibleProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        p.categories.some((c) => selectedCategories.includes(c.id));
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesPromotion = !onPromotionOnly || promotedProductIds.has(p.id);
      const matchesStock = !inStockOnly || p.stockQuantity > 0;
      return matchesSearch && matchesCategory && matchesPrice && matchesPromotion && matchesStock;
    });

    filtered = [...filtered].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name-asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return filtered;
  }, [products, search, selectedCategories, priceRange, sort, onPromotionOnly, inStockOnly, promotedProductIds]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Shop
          </Typography>
          {!loading && (
            <Typography variant="body2" color="text.secondary">
              {visibleProducts.length} product{visibleProducts.length !== 1 ? "s" : ""}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Sort by
          </Typography>
          <Select
            size="small"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            sx={{ minWidth: 180, bgcolor: "background.paper" }}
          >
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="name-asc">Name: A → Z</MenuItem>
            <MenuItem value="name-desc">Name: Z → A</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        size="small"
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: 200,
            flexShrink: 0,
            position: "sticky",
            top: 72,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>
            {isFiltered && (
              <Button size="small" onClick={clearFilters} sx={{ minWidth: 0, p: 0, fontSize: "0.75rem" }}>
                Clear
              </Button>
            )}
          </Box>

          {/* Categories */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Categories
          </Typography>
          <FormGroup sx={{ mt: 0.5, mb: 2 }}>
            {categories.map((cat) => (
              <FormControlLabel
                key={cat.id}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    sx={{ py: 0.25 }}
                  />
                }
                label={<Typography variant="body2">{cat.name}</Typography>}
                sx={{ ml: 0 }}
              />
            ))}
          </FormGroup>

          <Divider sx={{ mb: 2 }} />

          {/* Price */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Price
          </Typography>
          <Box sx={{ px: 1, mt: 1.5 }}>
            <Slider
              value={priceRange}
              min={priceMin}
              max={priceMax}
              onChange={(_e, val) => setPriceRange(val as [number, number])}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => fmt(v)}
              disabled={loading}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption" color="text.secondary">
                {fmt(priceRange[0])}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {fmt(priceRange[1])}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2, mt: 2 }} />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}
          >
            Availability
          </Typography>
          <FormGroup sx={{ mt: 0.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  sx={{ py: 0.25 }}
                />
              }
              label={<Typography variant="body2">In Stock Only</Typography>}
              sx={{ ml: 0 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={onPromotionOnly}
                  onChange={(e) => setOnPromotionOnly(e.target.checked)}
                  sx={{ py: 0.25 }}
                />
              }
              label={<Typography variant="body2">On Promotion</Typography>}
              sx={{ ml: 0 }}
            />
          </FormGroup>
        </Box>

        {/* Product grid */}
        {loading ? (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              mt: 8,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              flexGrow: 1,
              display: "grid",
              gap: 2,
              alignContent: "start",
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
                    image={product.imageUrl ?? ""}
                    alt={product.name}
                    sx={{ objectFit: "cover", bgcolor: "background.default", cursor: "pointer" }}
                    onClick={() => navigate(`/shop/${product.id}`)}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.src = `https://placehold.co/400x150/eeeeee/999999?text=${encodeURIComponent(product.name)}`;
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => toggleWishlist(product.id)}
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
                    {isWishlisted(product.id) ? (
                      <FavoriteIcon fontSize="small" color="error" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      fontSize: "0.78rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
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
                    {product.stockQuantity > 0 && product.stockQuantity < 5 && (
                      <Chip label="Low stock" size="small" color="warning" sx={{ height: 18, fontSize: "0.68rem" }} />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<AddShoppingCartIcon fontSize="small" />}
                    onClick={() => addItem(product.id, 1)}
                    disabled={product.stockQuantity === 0}
                  >
                    {product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </CardActions>
              </Card>
            ))}
            {visibleProducts.length === 0 && (
              <Typography
                color="text.secondary"
                sx={{ gridColumn: "1/-1", textAlign: "center", mt: 4 }}
              >
                No products match your filters.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Shop;
