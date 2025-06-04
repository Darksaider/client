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
import { AdminLayout, Layout } from "./components/Layaout";
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
import { UserProfile } from "./pages/client/ProfilePage";
import { Toaster } from "react-hot-toast";
import { ProfileLayout } from "./components/ProfileLayout";
import { AdminOrders, OrderUpdateForm } from "./pages/admin/user/adminOrders";
import { OrdersPage } from "./components/order";
// Додамо імпорти для нових сторінок (потрібно їх створити)

export const App: React.FC = () => {
  return (
    // Рекомендую використовувати класи Tailwind напряму тут або в Layout
    <div className="container mx-auto font-Montserrat">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Глобальні налаштування
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "14px",
            borderRadius: "8px",
          },
          success: {
            icon: "✅",
            style: {
              background: "#22c55e",
            },
          },
          error: {
            icon: "❌",
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="singIn" element={<SingInPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="me" element={<ProfileLayout />}>
            <Route path="profile" element={<UserProfile />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>

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
          <Route path="/orders/cancel" element={<PaymentCanceledPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          {/* Крок 3в: Сторінка "Дякуємо за замовлення" (Для методів оплати типу "При отриманні") */}
          {/* Потрібно створити компонент OrderThankYouPage */}
          {/* <Route
            path="/orders/thankyou/:orderId"
            element={<OrderThankYouPage />}
          /> */}
          {/* --- Адмін-панель --- */}
          {/* Можливо, для адмін-панелі варто створити окремий Layout */}

          {/* TODO: Додати маршрут для сторінки "Мої замовлення" користувача */}
          {/* <Route path="/orders" element={<UserOrdersPage />} /> */}
          {/* TODO: Додати маршрут для перегляду деталей конкретного замовлення користувача */}
          {/* <Route path="/orders/:orderId" element={<UserOrderDetailPage />} /> */}
          {/* TODO: Додати маршрут 404 Not Found */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
        <Route path="admin/" element={<AdminLayout />}>
          <Route path="users" element={<AdminUser />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="colors" element={<AdminColor />} />
          <Route path="sizes" element={<AdminSizes />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="tags" element={<AdminTags />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="discounts" element={<AdminDiscounts />} />
          <Route path="image" element={<ImageUploadForm />} />
          <Route path="newProduct" element={<OldAdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
};
