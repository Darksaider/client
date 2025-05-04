import { NavLink } from "react-router"; // Краще імпортувати звідси
import { FascoH1 } from "../UI/FascoH1";
import { RegularText } from "../UI/RegularText";
import { useAuth } from "../hooks/useLogin"; // Переконайтесь, що шлях правильний
import { Cart } from "./Cart"; // Переконайтесь, що шлях правильний

export const Header: React.FC = () => {
  const styleHav = "hover:text-gray-600 transition-colors duration-200";
  const { isLoggedIn, email, logout, role, isLoading } = useAuth();

  return (
    <header className="bg-white h-[8vh] flex justify-between items-center px-4 md:px-8 shadow-sm sticky top-0 z-50">
      <FascoH1 />
      <nav className="flex gap-4 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
          end
        >
          <RegularText>Головна</RegularText>
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Продукти</RegularText>
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
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
                <RegularText className={styleHav}>Увійти</RegularText>
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
                    isActive ? "text-blue-600 font-semibold" : styleHav
                  }
                >
                  <RegularText>Адмінка</RegularText>
                </NavLink>
              )}
              <div className="flex items-center gap-2">
                {email && (
                  <RegularText className="text-sm text-gray-600 hidden md:block">
                    {email}
                  </RegularText>
                )}
                <button
                  onClick={logout}
                  className={`${styleHav} text-sm text-red-600 hover:text-red-800`}
                >
                  Вийти
                </button>
              </div>
            </>
          )}
          {!isLoading && <Cart />}
        </div>
      </nav>
    </header>
  );
};
