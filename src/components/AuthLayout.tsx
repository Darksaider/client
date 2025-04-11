import React from "react";
import singInImage from "../assets/signInImage.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Секція із зображенням */}
      <div className="md:w-1/2 h-40 md:h-full relative">
        <img
          className="w-full h-full object-cover object-top"
          src={singInImage}
          alt="SignInImage"
        />
        {/* Накладення затемнення з логотипом для мобільної версії */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center md:hidden">
          <h1 className="font-Forum text-5xl text-white">FASCO</h1>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-between items-center p-6 md:p-10 font-Montserrat">
        {/* Логотип на десктопі */}
        <h1 className="font-Forum text-5xl md:text-7xl text-h1Title self-start hidden md:block">
          FASCO
        </h1>

        {children}
      </div>
    </div>
  );
};
