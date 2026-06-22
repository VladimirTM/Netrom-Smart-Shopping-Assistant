import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { Promotion } from "../../shared/types/Promotion";
import { PromotionReward, PromotionType } from "../../shared/types/Promotion";
import { promotionsApi } from "../../../api/clients/PromotionApiClient";
import { productsApi } from "../../../api/clients/ProductApiClient";
import { categoriesApi } from "../../../api/clients/CategoryApiClient";
import type { Product } from "../../shared/types/Product";
import type { Category } from "../../shared/types/Category";

interface PromotionFormDialogProps {
  promotion: Promotion | null;
  onClose: () => void;
  onSaved: () => void;
}

function PromotionFormDialog({
  promotion,
  onClose,
  onSaved,
}: PromotionFormDialogProps) {
  const isEditing = promotion !== null;

  const [name, setName] = useState(promotion?.name ?? "");
  const [type, setType] = useState<PromotionType>(
    promotion?.type ?? PromotionType.Quantity
  );
  const [threshold, setThreshold] = useState(
    promotion?.threshold.toString() ?? ""
  );
  const [reward, setReward] = useState<PromotionReward>(
    promotion?.reward ?? PromotionReward.PercentDiscount
  );
  const [rewardValue, setRewardValue] = useState(
    promotion?.rewardValue.toString() ?? ""
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isActive, setIsActive] = useState(promotion?.isActive ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [productInputValue, setProductInputValue] = useState("");
  const [searchingProducts, setSearchingProducts] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const cats = await categoriesApi.getAll();
        setCategories(cats);
        if (promotion?.categoryId != null) {
          setSelectedCategory(cats.find((c) => c.id === promotion.categoryId) ?? null);
        }
        if (promotion?.productId != null) {
          const prod = await productsApi.getById(promotion.productId);
          setSelectedProduct(prod);
          setProductOptions([prod]);
          setProductInputValue(prod.name);
        }
      } catch {
        setError("Failed to load options. Please close and try again.");
      } finally {
        setLoadingCategories(false);
      }
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleProductInputChange(_: React.SyntheticEvent, value: string) {
    setProductInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 1) {
      setProductOptions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearchingProducts(true);
      try {
        const results = await productsApi.search(value.trim());
        setProductOptions(results);
      } catch {
        // silently ignore search errors
      } finally {
        setSearchingProducts(false);
      }
    }, 300);
  }

  async function handleSave() {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    const parsedThreshold = parseFloat(threshold);
    if (isNaN(parsedThreshold) || parsedThreshold <= 0) {
      setError("Threshold must be a valid positive number.");
      return;
    }
    const parsedRewardValue = parseInt(rewardValue, 10);
    if (isNaN(parsedRewardValue) || parsedRewardValue <= 0) {
      setError("Reward value must be a valid positive integer.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = {
        name: name.trim(),
        type,
        threshold: parsedThreshold,
        reward,
        rewardValue: parsedRewardValue,
        productId: selectedProduct?.id,
        categoryId: selectedCategory?.id,
        isActive,
      };
      if (isEditing) {
        await promotionsApi.update(promotion.id, data);
      } else {
        await promotionsApi.create(data);
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Edit Promotion" : "Add Promotion"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error !== "" && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <FormControl fullWidth required>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value as PromotionType)}
            >
              <MenuItem value={PromotionType.Quantity}>Quantity</MenuItem>
              <MenuItem value={PromotionType.CartTotal}>Cart Total</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={
              type === PromotionType.Quantity
                ? "Threshold (items)"
                : "Threshold (RON)"
            }
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            fullWidth
            required
            type="number"
            slotProps={{ htmlInput: { min: 0, step: type === PromotionType.CartTotal ? 0.01 : 1 } }}
          />
          <FormControl fullWidth required>
            <InputLabel>Reward</InputLabel>
            <Select
              value={reward}
              label="Reward"
              onChange={(e) => setReward(e.target.value as PromotionReward)}
            >
              <MenuItem value={PromotionReward.FreeItems}>Free Items</MenuItem>
              <MenuItem value={PromotionReward.PercentDiscount}>
                Percent Discount
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={
              reward === PromotionReward.FreeItems
                ? "Reward Value (items)"
                : "Reward Value (%)"
            }
            value={rewardValue}
            onChange={(e) => setRewardValue(e.target.value)}
            fullWidth
            required
            type="number"
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <Autocomplete
            options={productOptions}
            getOptionLabel={(p) => `${p.name} (ID: ${p.id})`}
            value={selectedProduct}
            inputValue={productInputValue}
            onInputChange={handleProductInputChange}
            onChange={(_, value) => {
              setSelectedProduct(value);
              if (value) setSelectedCategory(null);
            }}
            disabled={selectedCategory !== null}
            loading={searchingProducts}
            filterOptions={(x) => x}
            noOptionsText={productInputValue.length < 1 ? "Type to search products" : "No products found"}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Product (optional)"
                helperText={selectedCategory ? "Clear Category first" : "Type a product name to search"}
                slotProps={{
                  ...params.slotProps,
                  input: {
                    ...params.slotProps?.input,
                    endAdornment: (
                      <>
                        {searchingProducts ? <CircularProgress size={16} /> : null}
                        {params.slotProps?.input?.endAdornment}
                      </>
                    ),
                  },
                }}
              />
            )}
          />
          <Autocomplete
            options={categories}
            getOptionLabel={(c) => `${c.name} (ID: ${c.id})`}
            value={selectedCategory}
            onChange={(_, value) => {
              setSelectedCategory(value);
              if (value) {
                setSelectedProduct(null);
                setProductInputValue("");
                setProductOptions([]);
              }
            }}
            disabled={selectedProduct !== null || loadingCategories}
            loading={loadingCategories}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category (optional)"
                helperText={selectedProduct ? "Clear Product first" : "Leave empty for cart-wide promotion"}
              />
            )}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Active"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={
            saving ? <CircularProgress size={16} color="inherit" /> : null
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PromotionFormDialog;
