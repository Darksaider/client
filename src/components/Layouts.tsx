// components/Layout.tsx
import React from "react";
import { Outlet } from "react-router"; // Важливо!
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AdminHeader } from "./AdminHeader";

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
