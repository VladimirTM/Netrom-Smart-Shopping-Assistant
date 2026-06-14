import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Analysis, Suggestion } from "../../shared/types/Analysis";
import { useCart } from "../../../context/CartContent/cart-context";
import { cartApi } from "../../../api/clients/CartApiClient";
import { fmt } from "../../../utils/currency";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface AnalyzeDialogProps {
  onClose: () => void;
}

const loadingMessages = [
  "Reading your cart...",
  "Checking promotions...",
  "Finding the best deals...",
  "Composing suggestions...",
];

type Decision = "approved" | "declined";

function AnalyzeDialog({ onClose }: AnalyzeDialogProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});
  const [addingId, setAddingId] = useState<number | null>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const { addItem } = useCart();

  useEffect(() => {
    cartApi
      .analyze()
      .then((data) => {
        setProgress(100);
        setAnalysis(data);
        setError("");
      })
      .catch((err: Error) => setError(err.message || "Failed to analyze cart"))
      .finally(() => setTimeout(() => setLoading(false), 300));
  }, []);

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setProgress((current) => (current >= 90 ? 90 : current + 3.75));
      setMessageIndex((current) => (current + 1) % loadingMessages.length);
    }, 700);
    return () => clearInterval(timer);
  }, [loading]);

  async function handleApprove(suggestion: Suggestion) {
    if (addingId !== null) return;
    setAddingId(suggestion.productId);
    try {
      await addItem(suggestion.productId, suggestion.quantity);
      setDecisions((current) => ({
        ...current,
        [suggestion.productId]: "approved",
      }));
    } finally {
      setAddingId(null);
    }
  }

  function handleDecline(suggestion: Suggestion) {
    setDecisions((current) => ({
      ...current,
      [suggestion.productId]: "declined",
    }));
  }

  const allDecided =
    analysis !== null &&
    analysis.suggestions.length > 0 &&
    analysis.suggestions.every((s) => decisions[s.productId] !== undefined);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pr: 6,
        }}
      >
        <AutoAwesomeIcon color="primary" />
        AI Cart Analysis
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography sx={{ mb: 2 }}>
              {loadingMessages[messageIndex]}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ transition: "value 0.4s ease" }}
            />
          </Box>
        )}
        {error !== "" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {analysis !== null && !loading && (
          <Stack spacing={2}>
            <Typography>{analysis.summary}</Typography>
            <Divider />

            {analysis.suggestions.length === 0 && (
              <Typography color="text.secondary">
                No suggestions for this cart.
              </Typography>
            )}

            {analysis.suggestions.map((suggestion) => {
              const decision = decisions[suggestion.productId];
              return (
                <Box
                  key={suggestion.productId}
                  sx={{
                    border: "1px solid",
                    borderColor:
                      decision === "approved"
                        ? "success.light"
                        : decision === "declined"
                          ? "divider"
                          : "divider",
                    borderRadius: 1,
                    p: 2,
                    opacity: decision === "declined" ? 0.55 : 1,
                    transition: "opacity 0.2s, border-color 0.2s",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {suggestion.name} × {suggestion.quantity}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {fmt(suggestion.price)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {suggestion.reason}
                  </Typography>
                  {suggestion.savings !== null && (
                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ mt: 0.5, fontWeight: 500 }}
                    >
                      Saves {fmt(suggestion.savings)}
                    </Typography>
                  )}
                  <Box sx={{ mt: 1.5 }}>
                    {decision === undefined ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          startIcon={addingId === suggestion.productId ? <CircularProgress size={14} color="inherit" /> : <CheckIcon />}
                          onClick={() => handleApprove(suggestion)}
                          disabled={addingId !== null}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={() => handleDecline(suggestion)}
                        >
                          Decline
                        </Button>
                      </Stack>
                    ) : (
                      <Chip
                        size="small"
                        icon={
                          decision === "approved" ? (
                            <CheckIcon />
                          ) : (
                            <CloseIcon />
                          )
                        }
                        label={
                          decision === "approved" ? "Added to cart" : "Declined"
                        }
                        color={decision === "approved" ? "success" : "default"}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              );
            })}

            {allDecided && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                  py: 2,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40, color: "success.main" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  All suggestions handled!
                </Typography>
                <Button variant="contained" onClick={onClose}>
                  Done
                </Button>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AnalyzeDialog;
