import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { NavLink, useNavigate } from "react-router"; // Імпортуємо для перенаправлення
import Input from "../../UI/Input";
import googleIcon from "../../assets/google.svg";
import Button from "../../UI/AnchorButton";
import { IFormRegisterInput, ServerResponse } from "../../types/types";

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate(); // Ініціалізуємо hook для навігації
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState<ServerResponse | null>(
    null,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<IFormRegisterInput>();

  // Ефект для перенаправлення після успішної реєстрації
  useEffect(() => {
    if (serverResponse?.success) {
      const redirectTimer = setTimeout(() => {
        navigate("/"); // Перенаправлення на головну сторінку
      }, 2000); // Затримка 2 секунди, щоб користувач побачив повідомлення про успіх

      return () => clearTimeout(redirectTimer);
    }
  }, [serverResponse, navigate]);

  const onSubmit: SubmitHandler<IFormRegisterInput> = async (data) => {
    setIsLoading(true);
    setServerResponse(null);

    try {
      const response = await axios.post("http://localhost:3000/users", {
        first_name: data.name,
        last_name: data.lastName,
        phone_number: data.phone,
        email: data.email,
        password_hash: data.password,
      });

      setServerResponse({
        success: true,
        message:
          response.data.message ||
          "Реєстрація успішна! Перенаправлення на головну сторінку...",
      });
      reset(); // Очищаємо форму при успішній реєстрації
    } catch (error) {
      // Обробка помилок від axios
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Помилка при реєстрації";
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

  return (
    <div className="w-full max-w-4/5 flex flex-col space-y-6">
      <h2 className="text-2xl font-Montserrat text-center mb-4">
        Створення облікового запису.
      </h2>

      {serverResponse && (
        <div
          className={`p-4 rounded-md ${serverResponse.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {serverResponse.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Введіть ім'я"
            {...register("name", {
              required: "Ім'я обов'язкове",
              minLength: {
                value: 3,
                message: "Ім'я повинно містити щонайменше 3 символи",
              },
              maxLength: {
                value: 20,
                message: "Ім'я повинно містити не більше 20 символів",
              },
            })}
            error={errors.name?.message}
          />

          <Input
            placeholder="Введіть прізвище"
            {...register("lastName", {
              required: "Прізвище обов'язкове",
              minLength: {
                value: 3,
                message: "Прізвище повинно містити щонайменше 3 символи",
              },
              maxLength: {
                value: 20,
                message: "Прізвище повинно містити не більше 20 символів",
              },
            })}
            error={errors.lastName?.message}
          />

          <Input
            placeholder="Введіть телефон"
            {...register("phone", {
              required: "Телефон обов'язковий",
              minLength: {
                value: 10,
                message: "Телефон повинен містити щонайменше 10 символів",
              },
            })}
            error={errors.phone?.message}
          />

          <Input
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

          <Input
            placeholder="Повторіть пароль"
            type="password"
            {...register("confirmPassword", {
              required: "Підтвердження паролю обов'язкове",
              validate: (value) =>
                value === watch("password") || "Паролі не співпадають",
            })}
            error={errors.confirmPassword?.message}
          />
        </div>

        <div className="pt-2 space-y-3">
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-black text-white py-3 px-4 rounded-md focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 font-semibold transition-all hover:bg-gray-800 disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? "Завантаження..." : "Зареєструватися"}
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
            href="http://localhost:3000/auth/google/login"
          >
            <img src={googleIcon} alt="Google Logo" className="mr-2 h-5 w-5" />
            <span className="font-medium">Увійти через Google</span>
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-600 mt-5">
        Маєте обліковий запис?{" "}
        <NavLink
          className="font-medium text-black hover:text-gray-800"
          to={"/singIn"}
        >
          {" "}
          Увійти
        </NavLink>
      </p>
    </div>
  );
};
