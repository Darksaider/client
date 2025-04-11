import React from "react";
import { AuthLayout } from "../../components/AuthLayout";
import { RegisterForm } from "../../components/forms/RegisterForm";

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <RegisterForm />
      <div className="text-sm text-gray-500 mt-8">
        Натискаючи "Зареєструватися", ви погоджуєтесь з
        <a href="#" className="text-black hover:underline ml-1">
          умовами використання FASCO
        </a>
      </div>
    </AuthLayout>
  );
};
