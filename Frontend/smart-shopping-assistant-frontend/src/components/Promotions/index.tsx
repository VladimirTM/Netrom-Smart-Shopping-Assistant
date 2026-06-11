import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import type { Promotion } from "../shared/types/Promotion";
import { PromotionReward, PromotionType } from "../shared/types/Promotion";
import { promotionsApi } from "../../api/clients/PromotionApiClient";
import PageHeader from "../common/PageHeader";
import PromotionFormDialog from "./PromotionFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";

const TYPE_LABELS: Record<PromotionType, string> = {
  [PromotionType.Quantity]: "Quantity",
  [PromotionType.CartTotal]: "Cart Total",
};

const REWARD_LABELS: Record<PromotionReward, string> = {
  [PromotionReward.FreeItems]: "Free Items",
  [PromotionReward.PercentDiscount]: "% Discount",
};

function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);

  const [deleting, setDeleting] = useState<Promotion | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadPromotions() {
    promotionsApi
      .getAll()
      .then((data) => {
        setPromotions(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(promotion: Promotion) {
    setEditing(promotion);
    setFormOpen(true);
  }

  function handleDeleteClick(promotion: Promotion) {
    setDeleting(promotion);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await promotionsApi.remove(deleting.id);
      loadPromotions();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadPromotions();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader
        title="Promotions"
        actionLabel="Add Promotion"
        onAction={handleAdd}
      />

      {error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Threshold</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reward</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {promotion.name}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {TYPE_LABELS[promotion.type]}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {promotion.type === PromotionType.CartTotal
                      ? `${promotion.threshold.toFixed(2)} RON`
                      : `${promotion.threshold} items`}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {REWARD_LABELS[promotion.reward]}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {promotion.reward === PromotionReward.PercentDiscount
                      ? `${promotion.rewardValue}%`
                      : `${promotion.rewardValue} items`}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={promotion.isActive ? "Active" : "Inactive"}
                      color={promotion.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(promotion)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(promotion)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {promotions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography
                      align="center"
                      color="text.secondary"
                      sx={{ py: 4 }}
                    >
                      No promotions yet. Click "Add Promotion" to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {formOpen && (
        <PromotionFormDialog
          promotion={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadPromotions();
          }}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete promotion"
        description={`Are you sure you want to delete "${deleting?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Promotions;
