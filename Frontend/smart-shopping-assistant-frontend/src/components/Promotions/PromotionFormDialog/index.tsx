import { useState } from "react";
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
  const [productId, setProductId] = useState(
    promotion?.productId?.toString() ?? ""
  );
  const [categoryId, setCategoryId] = useState(
    promotion?.categoryId?.toString() ?? ""
  );
  const [isActive, setIsActive] = useState(promotion?.isActive ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    const parsedThreshold = parseFloat(threshold);
    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      setError("Threshold must be a valid non-negative number.");
      return;
    }
    const parsedRewardValue = parseInt(rewardValue, 10);
    if (isNaN(parsedRewardValue) || parsedRewardValue < 0) {
      setError("Reward value must be a valid non-negative integer.");
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
        productId: productId !== "" ? parseInt(productId, 10) : undefined,
        categoryId: categoryId !== "" ? parseInt(categoryId, 10) : undefined,
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
          <TextField
            label="Product ID (optional)"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            fullWidth
            type="number"
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <TextField
            label="Category ID (optional)"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            fullWidth
            type="number"
            slotProps={{ htmlInput: { min: 1 } }}
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
