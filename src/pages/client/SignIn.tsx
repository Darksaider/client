import React from "react";
import { AuthLayout } from "../../components/AuthLayout";
import { LoginForm } from "../../components/forms/Loginform";

export const SingInPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginForm />
      <div className="text-sm text-gray-500 mt-8">
        Натискаючи "Увійти", ви погоджуєтесь з
        <a href="#" className="text-black hover:underline ml-1">
          умовами використання FASCO
        </a>
      </div>
    </AuthLayout>
  );
};
