import { Route, Routes } from "react-router";
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

export const App: React.FC = () => {
  return (
    <div className="container mx-auto font-Montserrat ">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/singIn" element={<SingInPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/admin/users" element={<AdminUser />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/brands" element={<AdminBrands />} />
        <Route path="/admin/colors" element={<AdminColor />} />
        <Route path="/admin/sizes" element={<AdminSizes />} />
        <Route path="/admin/tags" element={<AdminTags />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/discounts" element={<AdminDiscounts />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
};
