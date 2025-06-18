import React, { useState, useCallback } from "react"; // Додано useState, useCallback
import { UpdateUser, Review } from "./admin.type"; // Припустимо, UpdateUser підходить для форми
import { useExpandableRows } from "../../hooks/useExpandableRows";
import toast from "react-hot-toast";
import apiClient from "../../hooks/apiClient";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useComments } from "../../hooks/useComments";

const initialCommentsValues: Partial<Review> = {
  text: "",
  rating: 0,
};

export const AdminComments: React.FC = () => {
  const {
    data: commentsResponse,
    isLoading,
    refetch: refetchComments,
  } = useComments(); // Отримуємо користувачів та функцію refetch
  const { expandedRows, toggleRow } = useExpandableRows<number>([]); // Додано setExpandedRows
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // Стан для показу форми створення

  // --- Обробники Submit ---
  const handleUpdateSubmit = useCallback(
    async (userId: number, data: Review) => {
      try {
        // const formData = new FormData();

        // formData.append("first_name", data.first_name);
        // formData.append("last_name", data.last_name);
        // formData.append("email", data.email);
        // formData.append("phone_number", data.phone_number);
        // formData.append("role", data.role);

        // if (data.avatar_url[0] instanceof File) {
        //   formData.append("avatar_url", data.avatar_url[0]);
        // }
        // console.log(data.avatar_url[0]);

        // await axios.put(`http://localhost:3000/users/${userId}`, formData, {
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        //   },
        // });

        toggleRow(userId);
        refetchComments();
      } catch (error) {
        console.error("Помилка оновлення користувача:", error);
        // cartId("Помилка оновлення користувача");
        toast.error("Помилка оновлення користувача");
      }
    },
    [refetchComments, toggleRow],
  );

  const handleCreateSubmit = useCallback(
    async (data: UpdateUser) => {
      try {
        apiClient.post("users/", data);
        toast.success(`Користувача ${data.first_name} успішно створено!`);
        setShowCreateForm(false); // Сховати форму створення
        if (refetchComments) {
          refetchComments(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка створення користувача:", error);
        toast.error("Помилка створення користувача");
      }
    },
    [refetchComments],
  ); // Додано залежності

  // --- Визначення колонок таблиці ---
  const columns = [
    { header: "ID", key: "id", width: "10%" },
    {
      header: "Користувач",
      key: "user",
      width: "30%", // Змінено ширину
      render: (comment: Review) => (
        <div className="flex items-center">
          {comment.user.avatar_url ? (
            <img
              className="h-10 w-10 rounded-full mr-3 object-cover" // Додано object-cover
              src={comment.user.avatar_url}
              alt={`${comment.user.first_name} `}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }} // Ховаємо, якщо помилка
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 font-medium">
                {(comment.user.first_name?.charAt(0) || "").toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-sm font-medium text-gray-900 truncate">{`${comment.user.first_name || ""} `}</div>
        </div>
      ),
    },
    {
      header: "Email",
      key: "email",
      width: "25%",
      render: (comment: Review) => (
        <span className="text-sm text-gray-600">{comment.text}</span>
      ),
    }, // Додано стиль

    {
      header: "Дії",
      key: "actions",
      width: "20%", // Змінено ширину
      render: (user: Review) => (
        <div className="flex space-x-2">
          <button
            onClick={() => toggleRow(user.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            {expandedRows.includes(user.id) ? "Згорнути" : "Редагувати"}
          </button>
          <button className="text-red-600 hover:text-red-900 text-sm">
            Видалити
          </button>
        </div>
      ),
    },
  ];

  const commentsFormFields: FormField<Review>[] = [
    {
      name: "text",
      label: "Текст відгуку",
      type: "text",
      validation: {
        required: "Ім'я обов'язкове",
        minLength: {
          value: 2,
          message: "Ім'я повинно містити мінімум 2 символи",
        },
      },
    },
    {
      name: "rating",
      label: "Прізвище",
      type: "text",
      validation: {
        required: "Прізвище обов'язкове",
        minLength: {
          value: 2,
          message: "Прізвище повинно містити мінімум 2 символи",
        },
      },
    },
  ];

  const renderUserUpdateForm = useCallback(
    (comment: Review) => (
      <GenericForm<Review>
        key={`update-form-${comment.id}`} // Ключ для переініціалізації
        // Припускаємо, що UpdateUser є підмножиною User або GenericForm ігнорує зайві поля
        defaultValues={comment as Review}
        fields={commentsFormFields}
        onSubmit={(data) => handleUpdateSubmit(comment.id, data)}
        title={`Редагування: ${comment.user.first_name} `}
        submitLabel="Оновити відгуки"
        className="border-t pt-4 mt-2"
      />
    ),
    [commentsFormFields, handleUpdateSubmit],
  ); // Додано залежності

  // --- Рендеринг компонента ---
  return (
    <div className="p-4 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Управління користувачами
        </h1>
        {/* {!showCreateForm && (
          <button
            onClick={() => {
              setShowCreateForm(true);
              // setExpandedRows([]); // Закриваємо редагування
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition duration-150 ease-in-out" // Змінено колір
          >
            + Додати користувача
          </button>
        )} */}
      </div>
      {/* --- Форма СТВОРЕННЯ (якщо активна) --- */}
      {showCreateForm && (
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-md">
          <GenericForm<Review> // Використовуємо той же тип форми
            key="create-user-form"
            defaultValues={initialCommentsValues as Review} // Порожні значення
            fields={commentsFormFields} // Той же набір полів (без пароля!)
            onSubmit={handleCreateSubmit} // Обробник створення
            title="Створення нового користувача"
            submitLabel="Створити користувача"
            className="bg-white shadow-none p-0 border-0"
          />
          {/* УВАГА: Додайте сюди поле для введення пароля, якщо воно потрібне окремо від GenericForm */}
          <button
            onClick={() => setShowCreateForm(false)}
            className="mt-3 text-sm text-gray-600 hover:text-gray-800"
          >
            Скасувати
          </button>
        </div>
      )}
      <GenericTable<Review> // Вказуємо тип даних для таблиці
        // Переконуємось, що передаємо масив користувачів, а не весь об'єкт відповіді
        data={commentsResponse || []} // Якщо useUsers повертає безпосередньо масив
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderUserUpdateForm}
        isLoading={isLoading}
        emptyMessage="Немає користувачів для відображення."
        // className="shadow-md rounded-lg overflow-hidden"
      />
    </div>
  );
};
