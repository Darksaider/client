import { NavLink } from "react-router";
import { useState, useEffect } from "react";
import { FascoH1 } from "../UI/FascoH1";
import { RegularText } from "../UI/RegularText";
import { Cart } from "./Cart";
import { useAuthContext } from "../hooks/useLoginContext";

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const styleNav = "hover:text-gray-600 transition-colors duration-200";

  const { isLoggedIn, role, logout, isLoading } = useAuthContext();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Блокуємо скрол коли меню відкрите
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, isLoading]);

  return (
    <header className="bg-white h-[8vh] flex justify-between items-center px-4 md:px-8 shadow-sm sticky top-0 z-50">
      <FascoH1 />

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex gap-4 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleNav
          }
          end
        >
          <RegularText>Головна</RegularText>
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleNav
          }
        >
          <RegularText>Продукти</RegularText>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleNav
          }
        >
          <RegularText>Про нас</RegularText>
        </NavLink>

        <div className="flex items-center gap-4 ml-4">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse bg-gray-200 rounded"></div>
          ) : !isLoggedIn ? (
            <>
              <NavLink to="/singIn">
                <RegularText className={styleNav}>Увійти</RegularText>
              </NavLink>
              <NavLink to="/register">
                <RegularText className="bg-black hover:bg-gray-800 transition-colors duration-200 px-4 py-2 rounded-md text-white text-sm">
                  Зареєструватися
                </RegularText>
              </NavLink>
            </>
          ) : (
            <>
              {role === "admin" && (
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    isActive ? "text-blue-600 font-semibold" : styleNav
                  }
                >
                  <RegularText>Адмінка</RegularText>
                </NavLink>
              )}
              <div className="flex items-center gap-2">
                <NavLink to="me/profile">
                  <RegularText className="text-sm text-gray-600 hidden xl:block">
                    Перейти до профілю
                  </RegularText>
                  <RegularText className="text-sm text-gray-600 xl:hidden">
                    Профіль
                  </RegularText>
                </NavLink>

                <button
                  onClick={logout}
                  className={`${styleNav} text-sm text-red-600 hover:text-red-800`}
                >
                  Вийти
                </button>
              </div>
            </>
          )}
          {!isLoading && <Cart />}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center gap-2">
        {!isLoading && <Cart />}

        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center relative">
            <span
              className={`bg-gray-800 block transition-all duration-300 h-0.5 w-6 rounded-sm absolute ${isMobileMenuOpen ? "rotate-45" : "-translate-y-1.5"}`}
            ></span>
            <span
              className={`bg-gray-800 block transition-all duration-300 h-0.5 w-6 rounded-sm absolute ${isMobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`bg-gray-800 block transition-all duration-300 h-0.5 w-6 rounded-sm absolute ${isMobileMenuOpen ? "-rotate-45" : "translate-y-1.5"}`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-screen w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 border-b">
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col p-6 space-y-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md transition-colors duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
            onClick={closeMobileMenu}
            end
          >
            <RegularText>Головна</RegularText>
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md transition-colors duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
            onClick={closeMobileMenu}
          >
            <RegularText>Продукти</RegularText>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-md transition-colors duration-200 ${
                isActive
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`
            }
            onClick={closeMobileMenu}
          >
            <RegularText>Про нас</RegularText>
          </NavLink>

          <div className="border-t pt-4 mt-4">
            {isLoading ? (
              <div className="h-8 w-32 animate-pulse bg-gray-200 rounded"></div>
            ) : !isLoggedIn ? (
              <div className="space-y-3">
                <NavLink
                  to="/singIn"
                  onClick={closeMobileMenu}
                  className="block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <RegularText>Увійти</RegularText>
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block"
                >
                  <RegularText className="bg-black hover:bg-gray-800 transition-colors duration-200 px-4 py-2 rounded-md text-white text-sm block text-center">
                    Зареєструватися
                  </RegularText>
                </NavLink>
              </div>
            ) : (
              <div className="space-y-3">
                {role === "admin" && (
                  <NavLink
                    to="/admin/products"
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded-md transition-colors duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-600 font-semibold"
                          : "hover:bg-gray-100"
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <RegularText>Адмінка</RegularText>
                  </NavLink>
                )}

                <NavLink
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="block py-2 px-4 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                  <RegularText className="text-gray-600">
                    Перейти до профілю
                  </RegularText>
                </NavLink>

                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left py-2 px-4 rounded-md hover:bg-red-50 transition-colors duration-200 text-red-600 hover:text-red-800"
                >
                  <RegularText>Вийти</RegularText>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
