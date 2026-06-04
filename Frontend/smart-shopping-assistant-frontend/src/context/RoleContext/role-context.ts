import { createContext, useContext } from "react";

export type Role = "user" | "admin";

export interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

export const RoleContext = createContext<RoleContextValue | null>(null);

export function useRole() {
  const context = useContext(RoleContext);
  if (context === null) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
