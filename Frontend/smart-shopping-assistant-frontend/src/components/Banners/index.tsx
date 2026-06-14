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
import type { Banner } from "../shared/types/Banner";
import { bannersApi } from "../../api/clients/BannerApiClient";
import PageHeader from "../common/PageHeader";
import BannerFormDialog from "./BannerFormDialog";
import ConfirmDialog from "../common/ConfirmDialog";

function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);

  const [deleting, setDeleting] = useState<Banner | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function loadBanners() {
    bannersApi
      .getAll()
      .then((data) => {
        setBanners(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function handleEdit(banner: Banner) {
    setEditing(banner);
    setFormOpen(true);
  }

  function handleDeleteClick(banner: Banner) {
    setDeleting(banner);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (deleting === null) return;
    setConfirmOpen(false);
    try {
      await bannersApi.remove(deleting.id);
      loadBanners();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader title="Banners" actionLabel="Add Banner" onAction={handleAdd} />

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
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Subtitle</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Link</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Order</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{banner.title}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {banner.subtitle ?? "—"}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {banner.linkTo ?? "—"}
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {banner.displayOrder}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={banner.isActive ? "Active" : "Inactive"}
                      color={banner.isActive ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(banner)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(banner)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {banners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography
                      align="center"
                      color="text.secondary"
                      sx={{ py: 4 }}
                    >
                      No banners yet. Click "Add Banner" to create one.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {formOpen && (
        <BannerFormDialog
          banner={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            loadBanners();
          }}
        />
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete banner"
        description={`Are you sure you want to delete "${deleting?.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Container>
  );
}

export default Banners;
