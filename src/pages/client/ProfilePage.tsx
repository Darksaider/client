import { SubmitHandler, useForm } from "react-hook-form";
import Input from "../../UI/Input";
import { useUser } from "../../hooks/useUsers";
import { formatDateForInput } from "../../components/formatData";
import { useEffect, useState } from "react";
import apiClient from "../../hooks/apiClient";
import { SkeletonLoadingProfile } from "../../components/skeleton/UserProfileSkeleton";

// Типи для форми зміни паролю
interface ResetPasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Типи для форми профілю
interface ProfileForm {
  name: string;
  lastName: string;
  phone: string;
  email: string;
}

const UserResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ResetPasswordForm>();
  const [error, setError] = useState<string>("");

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    try {
      const res = await apiClient.post("/users/passwordChanges", data);
      if (!res.data.success) setError(res.data.massage);
      reset();
    } catch (error: any) {
      console.error("Помилка при зміні паролю:", error);
      const message =
        error?.response?.data?.message || "Сталася помилка на сервері.";
      setError(message);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-black rounded-lg bg-white">
      <h3 className="text-lg font-semibold text-black">Змінити пароль</h3>
      {error}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Поточний пароль"
          type="password"
          {...register("currentPassword", {
            required: "Поточний пароль обов'язковий",
            minLength: {
              value: 8,
              message: "Пароль повинен містити щонайменше 8 символів",
            },
          })}
          error={errors.currentPassword?.message}
          className="text-black border-black"
        />

        <Input
          placeholder="Новий пароль"
          type="password"
          {...register("newPassword", {
            required: "Новий пароль обов'язковий",
            minLength: {
              value: 8,
              message: "Пароль повинен містити щонайменше 8 символів",
            },
          })}
          error={errors.newPassword?.message}
          className="text-black border-black"
        />

        <Input
          placeholder="Повторіть новий пароль"
          type="password"
          {...register("confirmNewPassword", {
            required: "Підтвердження паролю обов'язкове",
            validate: (value) =>
              value === watch("newPassword") || "Паролі не співпадають",
          })}
          error={errors.confirmNewPassword?.message}
          className="text-black border-black"
        />

        <button
          type="submit"
          className="w-full border border-black text-black py-2 px-4 rounded-md hover:bg-black hover:text-white transition-colors bg-white"
        >
          Змінити пароль
        </button>
      </form>
    </div>
  );
};

interface ProfileForm {
  name: string;
  lastName: string;
  phone: string;
  email: string;
}

export const UserProfile = () => {
  const { data, isLoading, refetch } = useUser(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileForm>();

  useEffect(() => {
    if (data) {
      setValue("name", data.first_name || "");
      setValue("lastName", data.last_name || "");
      setValue("phone", data.phone_number || "");
      setValue("email", data.email || "");
      setAvatarPreview(data.avatar_url || null);
    }
  }, [data, setValue]);

  // оновлюємо прев'ю при виборі файлу
  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(avatarFile);
    }
  }, [avatarFile]);

  const onSubmit: SubmitHandler<ProfileForm> = async (formData) => {
    setServerError(null);
    setSuccessMessage(null);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("last_name", formData.lastName);
      payload.append("phone_number", formData.phone);
      payload.append("email", formData.email);
      if (avatarFile) {
        payload.append("avatar_url", avatarFile);
      }

      const res = await apiClient.put(`/users/profile/`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data.success) {
        setServerError(res.data.message || "Не вдалось оновити профіль.");
        return;
      }

      setSuccessMessage("Профіль успішно оновлено!");
      refetch();
    } catch (error: any) {
      console.error("Помилка при оновленні профілю:", error);
      const msg =
        error?.response?.data?.message || "Сталася помилка на сервері.";
      setServerError(msg);
    }
  };

  if (isLoading) {
    return <SkeletonLoadingProfile />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-black">Особистий кабінет</h1>

      {serverError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {serverError}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Форма профілю */}
      <div className="mb-8 p-4 border border-black rounded-lg bg-white">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Основна інформація
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                placeholder="Введіть ім'я"
                {...register("name", {
                  required: "Ім'я обов'язкове",
                  minLength: {
                    value: 2,
                    message: "Ім'я повинно містити щонайменше 2 символи",
                  },
                  maxLength: {
                    value: 50,
                    message: "Ім'я повинно містити не більше 50 символів",
                  },
                })}
                error={errors.name?.message}
                className="text-black border-black"
              />

              <Input
                placeholder="Введіть прізвище"
                {...register("lastName", {
                  required: "Прізвище обов'язкове",
                  minLength: {
                    value: 2,
                    message: "Прізвище повинно містити щонайменше 2 символи",
                  },
                  maxLength: {
                    value: 50,
                    message: "Прізвище повинно містити не більше 50 символів",
                  },
                })}
                error={errors.lastName?.message}
                className="text-black border-black"
              />

              <Input
                placeholder="Введіть телефон"
                type="tel"
                {...register("phone", {
                  required: "Телефон обов'язковий",
                  pattern: {
                    value: /^[\+]?[0-9\s\-\(\)]{10,}$/,
                    message: "Неправильний формат телефону",
                  },
                })}
                error={errors.phone?.message}
                className="text-black border-black"
              />

              <Input
                placeholder="Email"
                type="email"
                {...register("email", {
                  required: "Email обов'язковий",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Неправильний формат email",
                  },
                })}
                error={errors.email?.message}
                className="text-black border-black"
              />
            </div>

            <div className="flex flex-col items-center space-y-4">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Аватар користувача"
                  className="w-32 h-32 object-cover rounded-full border-2 border-black"
                />
              ) : (
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-2 border-black">
                  <span className="text-black text-sm">Немає фото</span>
                </div>
              )}

              {/* Кастомна кнопка для завантаження */}
              <label className="cursor-pointer px-4 py-2 text-sm border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors bg-white">
                Змінити фото
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              {avatarFile && (
                <p className="text-sm text-black text-center max-w-[8rem] truncate">
                  {avatarFile.name}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto border border-black text-black py-2 px-6 rounded-md hover:bg-black hover:text-white transition-colors bg-white"
          >
            Зберегти зміни
          </button>
        </form>
      </div>

      <UserResetPassword />

      <div className="mt-8 p-4 border border-black rounded-lg bg-white">
        <p className="text-sm text-black">
          Обліковий запис створений: {formatDateForInput(data?.created_at)}
        </p>
        <p className="text-sm text-black mt-1">ID користувача: {data?.id}</p>
        <p className="text-sm text-black mt-1">Роль: {data?.role}</p>
      </div>
    </div>
  );
};

export default UserProfile;
