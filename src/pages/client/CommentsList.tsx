import { useComments } from "../../hooks/useComments";

export const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${filled ? "text-yellow-400" : "text-gray-300"} transition-colors`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
export const renderStars = (rating: number) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, index) => (
        <StarIcon key={index} filled={index < rating} />
      ))}
    </div>
  );
};
export const CommentsList = ({
  productId,
}: {
  productId: number | undefined;
}) => {
  const { data, isLoading, isError, error } = useComments(productId);

  // Функція для форматування дати
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 text-sm">Завантаження відгуків...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-red-500 text-sm font-medium">
            {error?.message || "Виникла помилка при завантаженні відгуків"}
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-center bg-gray-50 p-6 rounded-lg">
          <div className="text-gray-500 text-sm">Відгуки ще відсутні</div>
          <div className="text-xs text-gray-400 mt-1">
            Будьте першими, хто залишить відгук!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Відгуки користувачів
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {data.length}
          {data.length === 1
            ? " відгук"
            : data.length < 5
              ? " відгуки"
              : " відгуків"}
        </p>
      </div>

      <div className="space-y-4">
        {data.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start space-x-3 sm:space-x-4 mb-3">
              <div className="flex-shrink-0">
                <img
                  src={review.user.avatar_url}
                  alt={`Аватар ${review.user.first_name}`}
                  className="w-15 h-15 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.first_name)}&background=6366f1&color=fff&size=48`;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                      {review.user.first_name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
            </div>

            <div className="pl-0 sm:pl-16">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {review.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
