import { NavLink } from "react-router"; // Краще імпортувати звідси
import { FascoH1 } from "../UI/FascoH1";
import { RegularText } from "../UI/RegularText";
export const AdminHeader: React.FC = () => {
  const styleHav = "hover:text-gray-600 transition-colors duration-200";

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
          to="/admin/review"
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
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive ? "text-blue-600 font-semibold" : styleHav
          }
        >
          <RegularText>Категорії</RegularText>
        </NavLink>
      </nav>
    </header>
  );
};
