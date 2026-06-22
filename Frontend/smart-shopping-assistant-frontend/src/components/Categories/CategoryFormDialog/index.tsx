import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type { Category } from "../../shared/types/Category";
import { categoriesApi } from "../../../api/clients/CategoryApiClient";

interface CategoryFormDialogProps {
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

function CategoryFormDialog({
  category,
  onClose,
  onSaved,
}: CategoryFormDialogProps) {
  const isEditing = category !== null;

  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const data = { name: name.trim(), description: description.trim() || undefined };
      if (isEditing) {
        await categoriesApi.update(category.id, data);
      } else {
        await categoriesApi.create(data);
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? "Edit Category" : "Add Category"}</DialogTitle>
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
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
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

export default CategoryFormDialog;
