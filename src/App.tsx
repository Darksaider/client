import { Route, Routes } from "react-router"; // Виправлено імпорт на react-router-dom
import { HomePage } from "./pages/client/HomePage";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RegisterPage } from "./pages/client/RegisterPage";
import { ProductsPage } from "./pages/client/ProductsPage";
import { SingInPage } from "./pages/client/SignIn";
import { AdminUser } from "./pages/admin/adminUser";
import { AdminProducts } from "./pages/admin/adminProducts";
import { AdminBrands } from "./pages/admin/adminBrands";
import { AdminColor } from "./pages/admin/adminColors";
import { AdminSizes } from "./pages/admin/adminSizes";
import { AdminTags } from "./pages/admin/adminTags";
import { AdminCategories } from "./pages/admin/adminCategory";
import { AdminDiscounts } from "./pages/admin/adminDiscounts";
import { AdminLayout, Layout } from "./components/Layouts";

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
import { AdminOrders } from "./pages/admin/adminOrders";
import { OrdersPage } from "./components/UserOrders";
import { AdminComments } from "./pages/admin/adminComments";
import FAQPage from "./pages/client/FaqPage";
import { PrivacyPolicy } from "./pages/client/PrivacyPage";
import NotFound from "./pages/client/NotFoundPage";
import { ProfileLayout } from "./components/ProfileLayout";
import { ProductPage } from "./pages/client/ProductPage";
import { FavoritePage } from "./pages/client/FavoritePage";
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
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="singIn" element={<SingInPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="favorite" element={<FavoritePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          {/* <Route path="products/:id" element={<ProductPage />} /> */}
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="me" element={<ProfileLayout />}>
            <Route path="profile" element={<UserProfile />} />a
            <Route path="orders" element={<OrdersPage />} />
          </Route>

          <Route path="/checkout" element={<CheckoutPage />} />
          <Route
            path="/checkout/payment/:orderId"
            element={<OrderCheckoutPage />}
          />

          <Route path="/orders/success" element={<PaymentSuccessPage />} />
          <Route path="/orders/failed" element={<PaymentFailedPage />} />
          <Route path="/orders/cancel" element={<PaymentCanceledPage />} />
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
          <Route path="orders" element={<AdminOrders />} />
          <Route path="review" element={<AdminComments />} />
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
};
