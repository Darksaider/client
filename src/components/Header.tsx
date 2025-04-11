import { NavLink } from "react-router";
import { FascoH1 } from "../UI/FascoH1";
import { RegularText } from "../UI/RegularText";
import { useAuth } from "../hooks/useLogin";

export const Header: React.FC = () => {
  const styleHav = "hover:text-gray-600 ";
  const { isLoggedIn, email, logout, role } = useAuth();
  console.log();

  return (
    <header className="bg-white h-[8vh] flex justify-between items-center">
      <FascoH1 />
      <nav className="flex gap-4">
        <NavLink to="/" end>
          <RegularText className={styleHav}>Головна</RegularText>
        </NavLink>
        <NavLink to="/products">
          {" "}
          <RegularText className={styleHav}>Продукти</RegularText>
        </NavLink>
        <NavLink to="/about">
          <RegularText className={styleHav}>Про нас</RegularText>
        </NavLink>
        <NavLink to="/contact">
          <RegularText className={styleHav}>Контакти</RegularText>
        </NavLink>
        {!isLoggedIn ? (
          <div>
            <NavLink to="/singIn">
              <RegularText className={styleHav}>Увійти</RegularText>
            </NavLink>
            <NavLink to="/register">
              <RegularText className="bg-black  p-3.5 rounded-md text-white">
                Зареєструватися
              </RegularText>
            </NavLink>
          </div>
        ) : (
          <>
            {role === "admin" && (
              <NavLink to="/admin/products">
                <RegularText className={styleHav}>Адмінка</RegularText>
              </NavLink>
            )}

            <button onClick={logout}>Вийти {email}</button>
          </>
        )}
      </nav>
    </header>
  );
};
