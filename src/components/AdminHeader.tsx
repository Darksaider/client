import { NavLink } from "react-router"; // Краще імпортувати звідси
import { FascoH1 } from "../UI/FascoH1";
import { RegularText } from "../UI/RegularText";
import { useAuth } from "../hooks/useLogin"; // Переконайтесь, що шлях правильний
export const AdminHeader: React.FC = () => {
  const styleHav = "hover:text-gray-600 transition-colors duration-200";
  const { isLoggedIn, logout, role, isLoading } = useAuth();

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
          <RegularText>Вийти</RegularText>
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Продукти</RegularText>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Користувачі</RegularText>
        </NavLink>
        <NavLink
          to="/admin/brands"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Бренди</RegularText>
        </NavLink>
        <NavLink
          to="/admin/colors"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Кольори</RegularText>
        </NavLink>
        <NavLink
          to="/admin/sizes"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Розміри</RegularText>
        </NavLink>
        <NavLink
          to="/admin/discounts"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Знижки</RegularText>
        </NavLink>
        <NavLink
          to="/admin/comments"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Відгуки</RegularText>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Замовлення</RegularText>
        </NavLink>
        <div className="flex items-center gap-4 ml-4">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse bg-gray-200 rounded"></div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <NavLink to="/profile">
                  <RegularText className="text-sm text-gray-600 hidden md:block">
                    Перейти до профілю
                  </RegularText>
                </NavLink>

                <button
                  onClick={logout}
                  className={`${styleHav} text-sm text-red-600 hover:text-red-800`}
                >
                  Вийти
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
