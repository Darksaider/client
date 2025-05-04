import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../../UI/Input";
import googleIcon from "../../assets/google.svg";
import { NavLink, useNavigate } from "react-router";
import { IFormSingInInput, ServerResponse } from "../../types/types";
import { useAuth } from "../../hooks/useLogin";
import { Button } from "../../UI/AnchorButton";
import apiClient from "../../hooks/apiClient";

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormSingInInput>();

  const onSubmit: SubmitHandler<IFormSingInInput> = async (data) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/users/login", {
        email: data.email,
        password_hash: data.password,
      });
      login(response.data.user);
      setServerResponse({
        success: true,
        message:
          response.data.message ||
          "Вхід успішний! Перенаправлення на головну сторінку...",
      });
      reset();
    } catch (error) {
      if (error) {
        const errorMessage = "Не правильний логін або пароль";
        setServerResponse({
          success: false,
          message: errorMessage,
        });
      } else {
        setServerResponse({
          success: false,
          message: "Помилка з'єднання з сервером",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (serverResponse?.success) {
      const redirectTimer = setTimeout(() => {
        navigate("/"); // Перенаправлення на головну сторінку
      }, 2000); // Затримка 2 секунди, щоб користувач побачив повідомлення про успіх

      return () => clearTimeout(redirectTimer);
    }
  }, [serverResponse, navigate]);

  return (
    <div className="w-full max-w-md flex flex-col space-y-6 my-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Вхід до облікового запису
      </h2>
      {serverResponse && (
        <div
          className={`p-4 rounded-md ${serverResponse.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {serverResponse.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          <Input
            className="w-full rounded-md"
            placeholder="Email"
            {...register("email", {
              required: "Email обов'язковий",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Неправильний формат email",
              },
            })}
            error={errors.email?.message}
          />

          <Input
            className="w-full rounded-md"
            placeholder="Пароль"
            type="password"
            {...register("password", {
              required: "Пароль обов'язковий",
              minLength: {
                value: 8,
                message: "Пароль повинен містити щонайменше 8 символів",
              },
            })}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Запам'ятати мене
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-black hover:text-gray-700"
              >
                Забули пароль?
              </a>
            </div>
          </div>
        </div>

        <div className="pt-2 space-y-3">
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-black text-white py-3 px-4 rounded-md focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 font-semibold transition-all hover:bg-gray-800 disabled:opacity-70"
          >
            {isLoading ? "Завантаження..." : "Увійти"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">або</span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full flex items-center justify-center bg-white border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 transition-all focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            <img src={googleIcon} alt="Google Logo" className="mr-2 h-5 w-5" />
            <span className="font-medium">Увійти через Google</span>
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600 mt-5">
        Не маєте облікового запису?{" "}
        <NavLink
          className="font-medium text-black hover:text-gray-800"
          to={"/register"}
        >
          Зареєструватися
        </NavLink>
      </p>
    </div>
  );
};
