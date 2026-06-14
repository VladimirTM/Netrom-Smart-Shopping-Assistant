import { createContext, useContext } from "react";

export type ToastSeverity = "success" | "error" | "info" | "warning";

export interface ToastContextValue {
  showToast: (message: string, severity?: ToastSeverity) => void;
}

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}
