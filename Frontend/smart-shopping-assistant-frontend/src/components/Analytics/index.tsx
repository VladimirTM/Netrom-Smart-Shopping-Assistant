import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useEffect, useState } from "react";
import { analyticsApi } from "../../api/clients/AnalyticsApiClient";
import type { AnalyticsSummaryModel } from "../../api/models/AnalyticsSummaryModel";
import PageHeader from "../common/PageHeader";

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& .MuiSvgIcon-root": { color: "#1a1a00", fontSize: 24 },
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function Analytics() {
  const [summary, setSummary] = useState<AnalyticsSummaryModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    analyticsApi
      .getSummary()
      .then((data) => {
        setSummary(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PageHeader title="Analytics" />

      {error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : summary ? (
        <>
          {/* Summary cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<ShoppingCartIcon />}
                label="Active Carts"
                value={summary.totalCarts.toString()}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<AttachMoneyIcon />}
                label="Estimated Revenue"
                value={`${summary.estimatedRevenue.toFixed(2)} RON`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<TrendingUpIcon />}
                label="Top Products"
                value={summary.topProducts.length.toString()}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<LocalOfferIcon />}
                label="Active Promotions"
                value={summary.promotionUsage.length.toString()}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Top Products table */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Top Products by Cart Additions
              </Typography>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Cart Additions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.topProducts.map((p) => (
                      <TableRow key={p.productId} hover>
                        <TableCell>{p.name}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          {p.cartAdditions}
                        </TableCell>
                      </TableRow>
                    ))}
                    {summary.topProducts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography
                            align="center"
                            color="text.secondary"
                            sx={{ py: 2 }}
                          >
                            No cart data yet.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Promotion Usage table */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Active Promotions
              </Typography>
              <TableContainer component={Paper} elevation={2}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Promotion</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Usage Count
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.promotionUsage.map((p) => (
                      <TableRow key={p.promotionId} hover>
                        <TableCell>{p.name}</TableCell>
                        <TableCell align="right" sx={{ color: "text.secondary" }}>
                          {p.usageCount}
                        </TableCell>
                      </TableRow>
                    ))}
                    {summary.promotionUsage.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography
                            align="center"
                            color="text.secondary"
                            sx={{ py: 2 }}
                          >
                            No active promotions.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </>
      ) : null}
    </Container>
  );
}

export default Analytics;
