"use client";

import React from "react";

import HeaderDefault from "@/components/HeaderDefault";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <>
      <HeaderDefault />
      {children}
    </>
  );
};

export default ClientLayout;
