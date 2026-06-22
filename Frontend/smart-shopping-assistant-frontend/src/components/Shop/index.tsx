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
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext/toast-context";
import { productsApi } from "../../api/clients/ProductApiClient";
import { promotionsApi } from "../../api/clients/PromotionApiClient";
import { categoriesApi } from "../../api/clients/CategoryApiClient";
import { aiApi } from "../../api/clients/AiApiClient";
import type { Product } from "../shared/types/Product";
import type { Category } from "../shared/types/Category";
import { useCart } from "../../context/CartContent/cart-context";
import { useWishlist } from "../../context/WishlistContext/wishlist-context";
import { useAuth } from "../../context/AuthContext/auth-context";
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

  const [aiMode, setAiMode] = useState(false);
  const [aiResults, setAiResults] = useState<Product[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [addingId, setAddingId] = useState<number | null>(null);
  const [wishlistLoadingId, setWishlistLoadingId] = useState<number | null>(null);

  const { addItem, cart } = useCart();
  const { toggle: toggleWishlist, has: isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    // Products are required; categories are optional (failure hides the sidebar filter only)
    productsApi.getAll()
      .then((prods) => {
        setProducts(prods);

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

    // Categories are independent; failure only hides the sidebar category filter
    categoriesApi.getAll()
      .then(setCategories)
      .catch(() => { /* categories unavailable — sidebar filter hidden */ });
  }, []);

  // Re-apply category from URL param when categories are loaded or URL changes
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (!categoryParam || categories.length === 0) return;
    const catId = parseInt(categoryParam, 10);
    if (!isNaN(catId) && categories.some((c) => c.id === catId)) {
      setSelectedCategories([catId]);
    }
  }, [searchParams, categories]);

  useEffect(() => {
    if (!aiMode || !search.trim()) {
      setAiResults(null);
      return;
    }
    const timer = setTimeout(() => {
      setAiLoading(true);
      aiApi.semanticSearch(search)
        .then(setAiResults)
        .catch(() => setAiResults(null))
        .finally(() => setAiLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [search, aiMode]);

  // Global extremes (used to initialise the slider and "clear filters")
  const priceMin = useMemo(
    () => (products.length ? Math.floor(Math.min(...products.map((p) => p.price))) : 0),
    [products],
  );
  const priceMax = useMemo(
    () => (products.length ? Math.ceil(Math.max(...products.map((p) => p.price))) : 10000),
    [products],
  );

  // Effective slider bounds: filtered by everything EXCEPT price so the range shrinks with other filters
  const sliderBase = useMemo(() => {
    const base = aiMode && aiResults !== null ? aiResults : products;
    return base.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = aiMode || !q ? true : p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
      const matchesCategory = selectedCategories.length === 0 || p.categories.some((c) => selectedCategories.includes(c.id));
      const matchesPromotion = !onPromotionOnly || promotedProductIds.has(p.id);
      const matchesStock = !inStockOnly || p.stockQuantity > 0;
      return matchesSearch && matchesCategory && matchesPromotion && matchesStock;
    });
  }, [products, aiResults, aiMode, search, selectedCategories, onPromotionOnly, inStockOnly, promotedProductIds]);

  const sliderMin = useMemo(
    () => (sliderBase.length ? Math.floor(Math.min(...sliderBase.map((p) => p.price))) : priceMin),
    [sliderBase, priceMin],
  );
  const sliderMax = useMemo(
    () => (sliderBase.length ? Math.ceil(Math.max(...sliderBase.map((p) => p.price))) : priceMax),
    [sliderBase, priceMax],
  );

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
    // In AI mode use the AI-ranked results as the base; otherwise use all products.
    // The text search filter is skipped in AI mode because the AI already handled it.
    const base = aiMode && aiResults !== null ? aiResults : products;

    let filtered = base.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        aiMode || !q
          ? true
          : p.name.toLowerCase().includes(q) ||
            (p.description ?? "").toLowerCase().includes(q);
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
  }, [products, aiResults, aiMode, search, selectedCategories, priceRange, sort, onPromotionOnly, inStockOnly, promotedProductIds]);


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
              {aiMode && aiResults !== null && (
                <Typography component="span" variant="body2" color="primary" sx={{ ml: 0.5 }}>
                  (AI)
                </Typography>
              )}
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

      {/* Search + AI toggle */}
      <Box sx={{ display: "flex", gap: 1, mb: aiMode && !isAuthenticated ? 1 : 3, alignItems: "center" }}>
        <TextField
          placeholder={aiMode ? "Describe what you're looking for…" : "Search products by name or description"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  {aiLoading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <SearchIcon color="action" fontSize="small" />
                  )}
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <Tooltip title="Clear search">
                    <IconButton size="small" onClick={() => setSearch("")} edge="end">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : null,
            },
          }}
        />
        <Tooltip title={aiMode ? "Switch to keyword search" : "Switch to AI semantic search"}>
          <IconButton
            onClick={() => { setAiMode((m) => !m); setAiResults(null); }}
            sx={{
              border: "1px solid",
              borderColor: aiMode ? "primary.main" : "divider",
              borderRadius: 1,
              bgcolor: aiMode ? "primary.main" : "transparent",
              color: aiMode ? "primary.contrastText" : "text.secondary",
              "&:hover": {
                bgcolor: aiMode ? "primary.dark" : "action.hover",
              },
            }}
          >
            <AutoAwesomeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {aiMode && !isAuthenticated && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>AI search requires an account.</strong>{" "}
          <Typography
            component="span"
            variant="body2"
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/login", { state: { from: "/shop" } })}
          >
            Sign in
          </Typography>{" "}
          to use AI semantic search.
        </Alert>
      )}

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
              value={[Math.max(priceRange[0], sliderMin), Math.min(priceRange[1], sliderMax)]}
              min={sliderMin}
              max={sliderMax}
              onChange={(_e, val) => setPriceRange(val as [number, number])}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => fmt(v)}
              disabled={loading || sliderMin === sliderMax}
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
            {visibleProducts.map((product) => {
              const cartQty = cart?.items.find((i) => i.productId === product.id)?.quantity ?? 0;
              const effectiveStock = Math.max(0, product.stockQuantity - cartQty);
              const outOfStock = product.stockQuantity === 0;
              const atStockLimit = !outOfStock && effectiveStock === 0;
              const lowStock = effectiveStock > 0 && effectiveStock < 5;
              return (
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
                  {promotedProductIds.has(product.id) && (
                    <Chip
                      icon={<LocalOfferIcon sx={{ fontSize: "0.75rem !important" }} />}
                      label="Sale"
                      size="small"
                      color="secondary"
                      sx={{
                        position: "absolute",
                        top: 6,
                        left: 6,
                        height: 20,
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        "& .MuiChip-icon": { ml: 0.5 },
                      }}
                    />
                  )}
                  {!isAdmin && (
                    <Tooltip title={isWishlisted(product.id) ? "Remove from wishlist" : "Save to wishlist"}>
                      <span>
                        <IconButton
                          size="small"
                          disabled={wishlistLoadingId === product.id}
                          onClick={async () => {
                            if (!isAuthenticated) { navigate("/login"); return; }
                            const wasWishlisted = isWishlisted(product.id);
                            setWishlistLoadingId(product.id);
                            try {
                              await toggleWishlist(product.id);
                              showToast(wasWishlisted ? "Removed from wishlist" : "Saved to wishlist", wasWishlisted ? "info" : "success");
                            } catch {
                              showToast("Failed to update wishlist", "error");
                            } finally {
                              setWishlistLoadingId(null);
                            }
                          }}
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
                      </span>
                    </Tooltip>
                  )}
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
                    {outOfStock && (
                      <Chip label="Out of stock" size="small" color="error" sx={{ height: 18, fontSize: "0.68rem" }} />
                    )}
                    {!outOfStock && atStockLimit && (
                      <Chip label="Max in cart" size="small" color="warning" sx={{ height: 18, fontSize: "0.68rem" }} />
                    )}
                    {lowStock && (
                      <Chip label="Low stock" size="small" color="warning" sx={{ height: 18, fontSize: "0.68rem" }} />
                    )}
                  </Box>
                </CardContent>
                {!isAdmin && (
                  <CardActions sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
                    <Tooltip title={atStockLimit ? `You already have all ${effectiveStock} in stock in your cart` : ""} disableHoverListener={!atStockLimit}>
                      <span style={{ width: "100%" }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          startIcon={addingId === product.id ? <CircularProgress size={14} color="inherit" /> : <AddShoppingCartIcon fontSize="small" />}
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
                          disabled={outOfStock || atStockLimit || addingId === product.id}
                        >
                          {outOfStock ? "Out of Stock" : atStockLimit ? "Max in Cart" : "Add to Cart"}
                        </Button>
                      </span>
                    </Tooltip>
                  </CardActions>
                )}
              </Card>
              );
            })}
            {visibleProducts.length === 0 && !aiLoading && (
              <Box sx={{ gridColumn: "1/-1", textAlign: "center", mt: 6, color: "text.secondary" }}>
                <FilterListOffIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                <Typography variant="h6" color="text.secondary">No products found</Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
                  {search ? `No results for "${search}".` : "Try adjusting your filters."}
                </Typography>
                {(isFiltered || search) && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={() => { clearFilters(); setSearch(""); }}
                  >
                    Clear all filters
                  </Button>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Shop;
