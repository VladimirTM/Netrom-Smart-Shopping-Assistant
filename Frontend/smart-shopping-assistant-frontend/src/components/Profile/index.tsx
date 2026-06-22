import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { userApi, type UserProfile } from "../../api/clients/UserApiClient";
import { useToast } from "../../context/ToastContext/toast-context";

function Profile() {
  const { showToast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  useEffect(() => {
    userApi.getProfile()
      .then((p) => {
        setProfile(p);
        setDisplayName(p.displayName ?? "");
      })
      .catch((err: Error) => setLoadError(err.message || "Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSaveName() {
    setSavingName(true);
    try {
      const updated = await userApi.updateProfile(displayName.trim() || null);
      setProfile(updated);
      showToast("Display name updated.", "success");
    } catch {
      showToast("Failed to update display name.", "error");
    } finally {
      setSavingName(false);
    }
  }

  async function handleChangePassword() {
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setSavingPassword(true);
    try {
      await userApi.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password changed successfully.", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password.";
      setPasswordError(msg);
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{loadError}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        My Profile
      </Typography>

      {/* Read-only account info */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Account Info
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">Email</Typography>
        <Typography gutterBottom>{profile?.email ?? "—"}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Role</Typography>
        <Typography gutterBottom sx={{ textTransform: "capitalize" }}>{profile?.role ?? "—"}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Member since</Typography>
        <Typography>
          {profile?.createdAt
            ? new Date(profile.createdAt).toLocaleDateString("ro-RO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "—"}
        </Typography>
      </Paper>

      {/* Display name edit */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <PersonIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Display Name</Typography>
        </Box>
        <TextField
          fullWidth
          label="Display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSaveName}
          disabled={savingName}
          startIcon={savingName ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {savingName ? "Saving…" : "Save"}
        </Button>
      </Paper>

      {/* Change password */}
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <LockIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Change Password</Typography>
        </Box>
        {passwordError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {passwordError}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Current password"
          type={showCurrentPw ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowCurrentPw((v) => !v)} edge="end">
                    {showCurrentPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Divider sx={{ mb: 2 }} />
        <TextField
          fullWidth
          label="New password"
          type={showNewPw ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowNewPw((v) => !v)} edge="end">
                    {showNewPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          fullWidth
          label="Confirm new password"
          type={showConfirmPw ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          size="small"
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowConfirmPw((v) => !v)} edge="end">
                    {showConfirmPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleChangePassword}
          disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}
          startIcon={savingPassword ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {savingPassword ? "Saving…" : "Change Password"}
        </Button>
      </Paper>
    </Container>
  );
}

export default Profile;
