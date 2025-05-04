import { useComments } from "../admin/user/hooks";

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${filled ? "text-yellow-500" : "text-gray-300"}`}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const CommentsList = () => {
  // Використання TanStack Query для отримання даних
  const { data, isLoading, isError, error } = useComments();

  // Функція для відображення зірок рейтингу
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <StarIcon key={index} filled={index < rating} />
        ))}
      </div>
    );
  };

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
    return <div className="text-center py-6">Завантаження відгуків...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500">
        {error?.message || "Виникла помилка"}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-6">Відгуки відсутні</div>;
  }
  return (
    <div className="w-full  mx-auto">
      <h2 className="text-2xl font-bold mb-6">Відгуки користувачів</h2>
      <div className="space-y-4">
        {data.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {review.user.first_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </p>
              </div>
              {renderStars(review.rating)}
            </div>
            <p className="mt-3 text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
