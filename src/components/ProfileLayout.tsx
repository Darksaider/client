// components/Layout.tsx
import React from "react";
import { NavLink, Outlet } from "react-router"; // Важливо!
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RegularText } from "../UI/RegularText";

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
export const ProfileLayout: React.FC = () => {
  const styleNav = "hover:text-gray-600 transition-colors duration-200";
  return (
    <main className="flex-grow flex container mx-auto px-4 py-8">
      <aside className="flex flex-col flex-1/10">
        <NavLink
          to="profile"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleNav
          }
          end
        >
          <RegularText>Мій профіль</RegularText>
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleNav
          }
          end
        >
          <RegularText>Мої замовлення</RegularText>
        </NavLink>
      </aside>
      <section className="flex-9/10">
        <Outlet />
      </section>
    </main>
  );
};
