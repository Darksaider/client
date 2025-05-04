// src/components/Comments.tsx
import { useCallback, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCrudOperations } from "../../hooks/useCrud";
import { useComments } from "../admin/user/hooks";
import { useAuth } from "../../hooks/useLogin";
import { CommentsList } from "./CommentsList";

interface Comment {
  id?: number | string;
  product_id: number | string;
  text: string;
  rating: number;
  created_at?: string;
  updated_at?: string;
  user_id?: number | string;
}

type FormData = {
  text: string;
  rating: number;
};

export const Comments = ({ productId }: { productId: string | number }) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const apiUrlBase = import.meta.env.VITE_API_URL;
  const { isLoggedIn, isLoading: isAuthLoading } = useAuth();
  const { refetch: refetchComments, isLoading: isCommentsLoading } =
    useComments(
      typeof productId === "string" ? parseInt(productId, 10) : productId,
    );

  const formOptions = useMemo(
    () => ({
      defaultValues: {
        text: "",
        rating: 0,
      },
      mode: "onChange" as const, // Додаємо режим валідації при зміні
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>(formOptions);

  const { createItem } = useCrudOperations<Partial<Comment>, Comment>({
    resourceName: "Коментарі",
    apiEndpoint: "/comments",
    apiUrlBase,
    refetch: refetchComments,
  });

  const currentRating = watch("rating");

  // Функція для обробки надсилання форми з обробкою помилок
  const onSubmit = useCallback(
    async (data: FormData) => {
      if (data.rating === 0) {
        alert("Будь ласка, вкажіть рейтинг");
        return;
      }

      try {
        setIsSubmitting(true);

        const comment: Partial<Comment> = {
          product_id: +productId,
          text: data.text,
          rating: data.rating,
        };

        await createItem(comment);

        // Скидаємо форму та показуємо повідомлення про успіх
        reset();
        setSubmitted(true);

        // Через 3 секунди прибираємо повідомлення
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error("Помилка створення коментаря:", error);
        alert("Не вдалося відправити коментар. Спробуйте ще раз пізніше.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [createItem, productId, reset],
  );

  // Мемоізуємо масив зірок для запобігання зайвих ререндерів
  const starsArray = useMemo(() => [1, 2, 3, 4, 5], []);

  // Функція для відображення зірок рейтингу
  const renderStar = useCallback(
    (index: number) => {
      const filled = index <= (hoverRating || currentRating);

      return (
        <button
          type="button"
          key={index}
          className="focus:outline-none"
          onMouseEnter={() => setHoverRating(index)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setValue("rating", index)}
          aria-label={`Встановити рейтинг ${index}`}
        >
          <svg
            className={`w-8 h-8 cursor-pointer ${
              filled ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    },
    [hoverRating, currentRating, setValue],
  );

  // Відображення компонента залежно від стану автентифікації
  if (isAuthLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6  mx-auto my-4">
        <p className="text-center text-gray-600">Завантаження...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6  mx-auto my-4">
        <p className="text-center text-gray-600">
          Увійдіть до свого облікового запису, щоб залишити відгук.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6  mx-auto my-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Залишити відгук
      </h3>

      {submitted ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
          <p className="text-green-700">Дякуємо за ваш відгук!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Ваша оцінка<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-1">
              {starsArray.map(renderStar)}
              <span className="ml-2 text-sm text-gray-600">
                {currentRating > 0
                  ? `${currentRating} з 5`
                  : "Виберіть рейтинг"}
              </span>
            </div>
            <input
              type="hidden"
              {...register("rating", {
                required: "Рейтинг обов'язковий",
                min: { value: 1, message: "Вкажіть рейтинг" },
              })}
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-gray-700 font-medium mb-2"
            >
              Ваш коментар<span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              rows={4}
              className={`w-full px-3 py-2 border ${
                errors.text ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Поділіться своїми враженнями про товар..."
              {...register("text", {
                required: "Коментар обов'язковий",
                minLength: {
                  value: 3,
                  message: "Коментар повинен містити щонайменше 3 символи",
                },
              })}
              aria-invalid={errors.text ? "true" : "false"}
            />
            {errors.text && (
              <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-5 py-2 rounded-md font-medium ${
                isSubmitting || !isValid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Надсилання...
                </span>
              ) : (
                "Надіслати відгук"
              )}
            </button>
          </div>
        </form>
      )}
      <CommentsList />
    </div>
  );
};

export default Comments;
