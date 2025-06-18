// components/Layout.tsx
import React from "react";
import { NavLink, Outlet } from "react-router";
import { User, ShoppingBag } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RegularText } from "../UI/RegularText";

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const ProfileLayout: React.FC = () => {
  const styleNav =
    "group relative text-black hover:bg-black hover:text-white transition-all duration-300 px-6 py-4 rounded-lg border border-gray-200 hover:border-black shadow-sm hover:shadow-md transform hover:scale-105";

  return (
    <main className="flex-grow flex container mx-auto px-4 py-8 gap-12">
      <aside className="w-full sm:w-1/3 lg:w-1/4">
        <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-black mb-6 pb-3 border-b border-gray-200 flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            Профіль
          </h3>
          <nav className="flex flex-col gap-3">
            <NavLink
              to="profile"
              className={({ isActive }) =>
                isActive
                  ? "bg-black text-white px-6 py-4 rounded-lg border border-black font-medium shadow-md transform scale-105 relative overflow-hidden"
                  : styleNav
              }
              end
            >
              <div className="flex items-center gap-4">
                <User size={20} className="flex-shrink-0" />
                <RegularText>Мій профіль</RegularText>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </NavLink>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                isActive
                  ? "bg-black text-white px-6 py-4 rounded-lg border border-black font-medium shadow-md transform scale-105 relative overflow-hidden"
                  : styleNav
              }
              end
            >
              <div className="flex items-center gap-4">
                <ShoppingBag size={20} className="flex-shrink-0" />
                <RegularText>Мої замовлення</RegularText>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </NavLink>
          </nav>
        </div>
      </aside>
      <section className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-100 rounded-full transform -translate-x-12 translate-y-12"></div>
        <div className="relative z-10">
          <Outlet />
        </div>
      </section>
    </main>
  );
};
