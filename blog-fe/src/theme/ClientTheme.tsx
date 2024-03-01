"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import ClientLayout from "@/layouts/ClientLayout";
import { fetchSystemAuth } from "@/redux/sagas/auth/systemAuth";

const ClientTheme: React.FC<React.PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthLayout = usePathname().includes("auth");

  function renderChildren() {
    if (isAuthLayout) {
      return children;
    } else {
      return <ClientLayout>{children}</ClientLayout>;
    }
  }

  useEffect(() => {
    if (!isAuthLayout) {
      dispatch(fetchSystemAuth());
    }
  }, [isAuthLayout, dispatch]);
  return <>{renderChildren()}</>;
};

export default ClientTheme;
