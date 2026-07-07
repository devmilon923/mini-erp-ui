import { ProtectRoute } from "@/provider/protector";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    // <ProtectRoute roles={["admin", "manager", "employee"]}>
    //   {children}
    // </ProtectRoute>
    children
  );
}

export default layout;
