import { useState } from "react";
import type { ReactNode } from "react";
import { RoleContext } from "./role-context";
import type { Role } from "./role-context";

function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("user");

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export default RoleProvider;
