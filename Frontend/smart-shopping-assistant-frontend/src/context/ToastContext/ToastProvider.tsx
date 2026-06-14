import { useState, useCallback, type ReactNode } from "react";
import { Alert, Snackbar } from "@mui/material";
import { ToastContext, type ToastSeverity } from "./toast-context";

interface ToastState {
  message: string;
  severity: ToastSeverity;
  key: number;
}

function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string, severity: ToastSeverity = "success") => {
    setToast({ message, severity, key: Date.now() });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        key={toast?.key}
        open={toast !== null}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast?.severity ?? "success"}
          onClose={() => setToast(null)}
          variant="filled"
          sx={{ minWidth: 200 }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export default ToastProvider;
