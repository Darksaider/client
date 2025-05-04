import { Route, Routes } from "react-router"; // Виправлено імпорт на react-router-dom
import { HomePage } from "./pages/client/HomePage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RegisterPage } from "./pages/client/RegisterPage";
import { ProductPage } from "./pages/client/ProductPage";
import { ProductsPage } from "./pages/client/ProductsPage";
import { SingInPage } from "./pages/client/SignIn";
import { AdminUser } from "./pages/admin/user/adminUser";
import { AdminProducts } from "./pages/admin/user/adminProducts";
import { AdminBrands } from "./pages/admin/user/adminBrands";
import { AdminColor } from "./pages/admin/user/adminColors";
import { AdminSizes } from "./pages/admin/user/adminSizes";
import { AdminTags } from "./pages/admin/user/adminTags";
import { AdminCategories } from "./pages/admin/user/adminCategory";
import { AdminDiscounts } from "./pages/admin/user/adminDiscounts";
import { Layout } from "./components/Layaout";
import { ImageUploadForm } from "./pages/admin/user/image";
import { OldAdminProducts } from "./pages/admin/user/newAdmin";

// --- Компоненти оплати ---
// Переконайтесь, що шляхи до цих компонентів правильні
import CheckoutPage from "./components/paytment/CheckoutPage";
import { OrderCheckoutPage } from "./components/paytment/OrderCheckoutPage";
import PaymentSuccessPage from "./components/paytment/PaymentSuccessPage";
import PaymentFailedPage from "./components/paytment/PayptentFailedPage";
import PaymentCanceledPage from "./components/paytment/PaymentCanceledPage";
import { AboutPage } from "./pages/client/AboutPage";
// Додамо імпорти для нових сторінок (потрібно їх створити)

export const App: React.FC = () => {
  return (
    // Рекомендую використовувати класи Tailwind напряму тут або в Layout
    <div className="container mx-auto font-Montserrat">
      <Routes>
        {/* Основний Layout для клієнтської частини та деяких адмін сторінок? */}
        <Route path="/" element={<Layout />}>
          {/* --- Клієнтські маршрути --- */}
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="singIn" element={<SingInPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="products/:id" element={<ProductPage />} />
          {/* <Route path="cart" element={<CartPage />} /> */}
          {/* Додано маршрут кошика */}
          {/* --- Маршрути Оформлення та Оплати Замовлення --- */}
          {/* Крок 1: Сторінка форми оформлення (введення адреси і т.д.) */}
          {/* Видалено дублікат cartForm */}
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Крок 2: Сторінка підтвердження деталей замовлення та ініціації оплати (після створення замовлення в БД) */}
          {/* Використовуємо :orderId замість :id для ясності */}
          <Route
            path="/checkout/payment/:orderId"
            element={<OrderCheckoutPage />}
          />
          {/* Крок 3а: Сторінка успішної оплати (Повернення зі Stripe після успіху) */}
          {/* Змінено шлях з pay/ok на більш логічний */}

          <Route path="/orders/success" element={<PaymentSuccessPage />} />
          {/* Крок 3б: Сторінка скасування оплати (Повернення зі Stripe після скасування) */}
          {/* Потрібно створити компонент PaymentCancelPage */}
          <Route path="/orders/failed" element={<PaymentFailedPage />} />
          <Route path="//orders/cancel" element={<PaymentCanceledPage />} />
          {/* Крок 3в: Сторінка "Дякуємо за замовлення" (Для методів оплати типу "При отриманні") */}
          {/* Потрібно створити компонент OrderThankYouPage */}
          {/* <Route
            path="/orders/thankyou/:orderId"
            element={<OrderThankYouPage />}
          /> */}
          {/* --- Адмін-панель --- */}
          {/* Можливо, для адмін-панелі варто створити окремий Layout */}
          <Route path="admin/users" element={<AdminUser />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="/admin/brands" element={<AdminBrands />} />
          <Route path="admin/colors" element={<AdminColor />} />
          <Route path="admin/sizes" element={<AdminSizes />} />
          <Route path="admin/tags" element={<AdminTags />} />
          <Route path="admin/categories" element={<AdminCategories />} />
          <Route path="admin/discounts" element={<AdminDiscounts />} />
          <Route path="admin/image" element={<ImageUploadForm />} />
          <Route path="admin/newProduct" element={<OldAdminProducts />} />
          {/* TODO: Додати маршрут для сторінки "Мої замовлення" користувача */}
          {/* <Route path="/orders" element={<UserOrdersPage />} /> */}
          {/* TODO: Додати маршрут для перегляду деталей конкретного замовлення користувача */}
          {/* <Route path="/orders/:orderId" element={<UserOrderDetailPage />} /> */}
          {/* TODO: Додати маршрут 404 Not Found */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>

        {/* Маршрути без основного Layout (наприклад, окремий вхід в адмінку) */}
        {/* <Route path="/admin/login" element={<AdminLoginPage />} /> */}
      </Routes>
      {/* Інструменти розробника React Query */}
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
};
