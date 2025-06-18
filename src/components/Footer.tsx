import React from "react";
import { NavLink } from "react-router";
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 py-8 lg:py-12 border-t border-gray-200">
      <div className="container mx-auto px-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Fasco
              </h3>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                Ваш надійний партнер у світі якісних товарів та неперевершеного
                сервісу.
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-500">
              <span>&copy; {currentYear} Fasco. Всі права захищено.</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-500 pl-3">
              Контакти
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <a
                  href="mailto:info@fasco.com"
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm lg:text-base"
                >
                  info@fasco.com
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <a
                  href="tel:+380441234567"
                  className="text-gray-600 hover:text-green-600 transition-colors text-sm lg:text-base"
                >
                  +380 44 123 45 67
                </a>
              </div>
            </div>
          </div>

          {/* Соціальні мережі */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-900 border-l-4 border-purple-500 pl-3">
              Соціальні мережі
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Слідкуйте за нашими новинами та акціями
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="group flex items-center space-x-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg px-4 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  Facebook
                </span>
              </a>

              <a
                href="#"
                className="group flex items-center space-x-2 bg-white hover:bg-pink-50 border border-gray-200 hover:border-pink-300 rounded-lg px-4 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  color="red"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600">
                  Instagram
                </span>
              </a>

              <a
                href="#"
                className="group flex items-center space-x-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg px-4 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5 text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Нижня частина */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-4 text-xs lg:text-sm text-gray-500">
              <NavLink
                className="hover:text-gray-700 transition-colors"
                to={"/privacy"}
              >
                Політика конфіденційності
              </NavLink>
              <span className="hidden sm:inline">•</span>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Умови використання
              </a>

              <span className="hidden sm:inline">•</span>

              <NavLink
                className="hover:text-gray-700 transition-colors"
                to={"/faq"}
              >
                Допомога
              </NavLink>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span>Зроблено з</span>
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>в Україні</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
