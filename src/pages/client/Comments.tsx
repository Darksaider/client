// src/components/Comments.tsx
import { useCallback, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useCrudOperations } from "../../hooks/useCrud";
import { useAuth } from "../../hooks/useLogin";
import { CommentsList } from "./CommentsList";
import { Comment } from "../../types/types.ts";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useComments } from "../../hooks/useComments.ts";
import { StarRating } from "../../UI/StarRating.tsx";

type FormData = {
  text: string;
  rating: number;
};

export const Comments = ({ productId }: { productId: number | undefined }) => {
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
      mode: "onChange" as const,
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>(formOptions);

  const { createItem } = useCrudOperations<Partial<Comment>, Comment>({
    resourceName: "Коментарі",
    apiEndpoint: "/comments",
    apiUrlBase,
    refetch: refetchComments,
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (data.rating === 0) {
        return;
      }
      try {
        setIsSubmitting(true);

        const comment: Partial<Comment> = {
          product_id: productId,
          text: data.text,
          rating: data.rating,
        };
        await createItem(comment);
        reset();
        setSubmitted(true);
      } catch (error) {
        toast.error(
          "Не вдалося відправити коментар. Спробуйте ще раз пізніше.",
        );
        setSubmitted(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [createItem, productId, reset],
  );

  // Відображення компонента залежно від стану автентифікації
  if (isAuthLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mx-auto my-4 max-w-4xl">
        <div className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 text-sm">Завантаження...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mx-auto my-4 max-w-4xl">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-blue-800 text-sm sm:text-base">
              Увійдіть до свого облікового запису, щоб залишити відгук
            </p>
          </div>
        </div>
        <CommentsList productId={productId} />
      </div>
    );
  }
  if (isCommentsLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mx-auto my-4 ">
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Залишити відгук
        </h3>
        <p className="text-sm text-gray-500">
          Поділіться своїми враженнями про товар
        </p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-green-700 font-medium">Дякуємо за ваш відгук!</p>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-gray-800 font-semibold mb-3 text-sm sm:text-base">
              Ваша оцінка <span className="text-red-500">*</span>
            </label>
            {/* <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0">
              <div className="flex items-center justify-center sm:justify-start space-x-1">
                {starsArray.map(renderStar)}
              </div>
              <span className="text-sm text-gray-600 text-center sm:text-left sm:ml-3">
                {currentRating > 0
                  ? `${currentRating} з 5 зірок`
                  : "Оберіть рейтинг"}
              </span>
            </div> */}
            {/* <input
              type="hidden"
              {...register("rating", {
                required: "Рейтинг обов'язковий",
                min: { value: 1, message: "Вкажіть рейтинг" },
              })}
            /> */}
            <input type="hidden" {...register("rating")} />
            <StarRating
              rating={watch("rating")}
              setRating={(r) => setValue("rating", r)}
            />
            {errors.rating && (
              <p className="text-red-500 text-sm mt-2 text-center sm:text-left">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Текст коментаря */}
          <div>
            <label
              htmlFor="comment"
              className="block text-gray-800 font-semibold mb-3 text-sm sm:text-base"
            >
              Ваш коментар <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              rows={4}
              className={`w-full px-4 py-3 border-2 ${
                errors.text ? "border-red-300 bg-red-50" : "border-gray-200"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base`}
              placeholder="Розкажіть про свої враження від товару, його якість, доставку та інше..."
              {...register("text", {
                required: "Коментар обов'язковий",
                minLength: {
                  value: 10,
                  message: "Коментар повинен містити щонайменше 10 символів",
                },
                maxLength: {
                  value: 500,
                  message: "Коментар не повинен перевищувати 500 символів",
                },
              })}
              aria-invalid={errors.text ? "true" : "false"}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.text ? (
                <p className="text-red-500 text-sm">{errors.text.message}</p>
              ) : (
                <div></div>
              )}
              <span className="text-xs text-gray-400">
                {watch("text")?.length || 0}/500
              </span>
            </div>
          </div>

          {/* Кнопка відправки */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className={`w-full sm:w-auto min-w-[140px] px-6 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
                isSubmitting || !isValid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
      <div className="mt-8 pt-6 border-t border-gray-200">
        <CommentsList productId={productId} />
      </div>
    </div>
  );
};
