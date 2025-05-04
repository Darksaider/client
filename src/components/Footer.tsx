import React from "react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-800 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Fasco</h3>
            <p className="text-gray-600">
              &copy; {currentYear} Fasco. Всі права захищено.
            </p>
          </div>

          <div className="flex space-x-8">
            <div>
              <h4 className="font-semibold mb-2">Контакти</h4>
              <ul className="text-gray-600">
                <li>info@fasco.com</li>
                <li>+380 44 123 45 67</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Соціальні мережі</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Facebook
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Instagram
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
