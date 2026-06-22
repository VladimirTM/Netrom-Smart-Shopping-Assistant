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
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import type { Banner } from "../../shared/types/Banner";
import { bannersApi } from "../../../api/clients/BannerApiClient";

interface BannerFormDialogProps {
  banner: Banner | null;
  onClose: () => void;
  onSaved: () => void;
}

function BannerFormDialog({ banner, onClose, onSaved }: BannerFormDialogProps) {
  const isEditing = banner !== null;

  const [title, setTitle] = useState(banner?.title ?? "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle ?? "");
  const [imageUrl, setImageUrl] = useState(banner?.imageUrl ?? "");
  const [linkTo, setLinkTo] = useState(banner?.linkTo ?? "");
  const [promotionId, setPromotionId] = useState(
    banner?.promotionId?.toString() ?? ""
  );
  const [displayOrder, setDisplayOrder] = useState(
    banner?.displayOrder.toString() ?? "0"
  );
  const [isActive, setIsActive] = useState(banner?.isActive ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function isValidUrl(value: string): boolean {
    if (value.startsWith("/")) return true;
    try { new URL(value); return true; } catch { return false; }
  }

  async function handleSave() {
    if (title.trim() === "") {
      setError("Title is required.");
      return;
    }
    if (imageUrl.trim() !== "" && !isValidUrl(imageUrl.trim())) {
      setError("Image URL must be a valid URL (e.g. https://example.com/image.jpg).");
      return;
    }
    if (linkTo.trim() !== "" && !isValidUrl(linkTo.trim())) {
      setError("Link URL must be a valid URL (e.g. https://example.com).");
      return;
    }
    const parsedOrder = parseInt(displayOrder, 10);
    if (isNaN(parsedOrder)) {
      setError("Display order must be a valid number.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        linkTo: linkTo.trim() || undefined,
        promotionId: promotionId !== "" ? parseInt(promotionId, 10) : undefined,
        displayOrder: parsedOrder,
        isActive,
      };
      if (isEditing) {
        await bannersApi.update(banner.id, data);
      } else {
        await bannersApi.create(data);
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Banner" : "Add Banner"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error !== "" && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <TextField
            label="Subtitle (optional)"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="Link URL (optional)"
            value={linkTo}
            onChange={(e) => setLinkTo(e.target.value)}
            fullWidth
          />
          <TextField
            label="Promotion ID (optional)"
            value={promotionId}
            onChange={(e) => setPromotionId(e.target.value)}
            fullWidth
            type="number"
            slotProps={{ htmlInput: { min: 1 } }}
          />
          <TextField
            label="Display Order"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
            fullWidth
            required
            type="number"
            slotProps={{ htmlInput: { min: 0 } }}
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

export default BannerFormDialog;
