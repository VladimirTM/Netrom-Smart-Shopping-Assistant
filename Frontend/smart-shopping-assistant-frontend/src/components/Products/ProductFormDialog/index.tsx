import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { Product } from "../../shared/types/Product";
import { productsApi } from "../../../api/clients/ProductApiClient";
import { categoriesApi } from "../../../api/clients/CategoryApiClient";
import type { Category } from "../../shared/types/Category";

interface ProductFormDialogProps {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

function ProductFormDialog({ product, onClose, onSaved }: ProductFormDialogProps) {
  const isEditing = product !== null;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity.toString() ?? "0");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
    product?.categories.map((c) => c.id) ?? []
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories).catch(() => {});
  }, []);

  async function handleSave() {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }
    const parsedStock = parseInt(stockQuantity, 10);
    if (isNaN(parsedStock) || parsedStock < 0) {
      setError("Stock quantity must be a valid non-negative integer.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: parsedPrice,
        imageUrl: imageUrl.trim() || undefined,
        stockQuantity: parsedStock,
        categoryIds: selectedCategoryIds,
      };
      if (isEditing) {
        await productsApi.update(product.id, data);
      } else {
        await productsApi.create(data);
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>
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
          <TextField
            label="Price (RON)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            required
            type="number"
            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="Stock Quantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            fullWidth
            required
            type="number"
            slotProps={{ htmlInput: { min: 0, step: 1 } }}
          />
          <FormControl fullWidth>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={selectedCategoryIds}
              onChange={(e) =>
                setSelectedCategoryIds(e.target.value as number[])
              }
              input={<OutlinedInput label="Categories" />}
              renderValue={(selected) =>
                categories
                  .filter((c) => selected.includes(c.id))
                  .map((c) => c.name)
                  .join(", ")
              }
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox checked={selectedCategoryIds.includes(category.id)} />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductFormDialog;
