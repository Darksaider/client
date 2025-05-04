import React, { useState, useCallback } from "react"; // Додано useState, useCallback
import { useUsers } from "../useUsers"; // Переконайтесь, що useUsers повертає refetch
import { User, UpdateUser } from "../admin.type"; // Припустимо, UpdateUser підходить для форми
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { StatusBadge } from "./StatusBadge";
import { useExpandableRows } from "./useExpandableRows";
import axios from "axios";

const initialUserValues: Partial<UpdateUser> = {
  first_name: "",
  last_name: "",
  password_hash: "",
  email: "",
  phone_number: "",
  avatar_url: "",
  role: "customer",
};

export const AdminUser: React.FC = () => {
  // --- Хуки ---
  const {
    data: usersResponse,
    isLoading,
    refetch: refetchUsers,
  } = useUsers(true); // Отримуємо користувачів та функцію refetch
  const { expandedRows, toggleRow } = useExpandableRows<number>([]); // Додано setExpandedRows
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // Стан для показу форми створення

  // --- Обробники Submit ---
  const handleUpdateSubmit = useCallback(
    async (userId: number, data: UpdateUser) => {
      console.log(data);

      console.log(`Оновлення користувача з ID ${userId}:`, data);
      // Тут ваш API виклик для ОНОВЛЕННЯ
      try {
        axios.put(`http://localhost:3000/users/${userId}`, data);
        alert(`Користувача ${data.first_name} успішно оновлено!`);
        toggleRow(userId); // Згорнути рядок
        if (refetchUsers) {
          refetchUsers(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка оновлення користувача:", error);
        alert("Помилка оновлення користувача");
      }
    },
    [refetchUsers, toggleRow],
  ); // Додано залежності

  const handleCreateSubmit = useCallback(
    async (data: UpdateUser) => {
      // Приймає тип даних форми
      console.log("Створення нового користувача:", data);
      try {
        axios.post("http://localhost:3000/users/", data);
        alert(`Користувача ${data.first_name} успішно створено!`);
        setShowCreateForm(false); // Сховати форму створення
        if (refetchUsers) {
          refetchUsers(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка створення користувача:", error);
        alert("Помилка створення користувача");
      }
    },
    [refetchUsers],
  ); // Додано залежності

  // --- Конфігурація статусів для ролей ---
  const userRoleStatusConfig = {
    admin: "bg-red-100 text-red-800",
    customer: "bg-blue-100 text-blue-800", // Змінено колір для customer
  };

  // --- Визначення колонок таблиці ---
  const columns = [
    { header: "ID", key: "id", width: "10%" },
    {
      header: "Користувач",
      key: "user",
      width: "30%", // Змінено ширину
      render: (user: User) => (
        <div className="flex items-center">
          {user.avatar_url ? (
            <img
              className="h-10 w-10 rounded-full mr-3 object-cover" // Додано object-cover
              src={user.avatar_url}
              alt={`${user.first_name} ${user.last_name}`}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }} // Ховаємо, якщо помилка
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 font-medium">
                {(user.first_name?.charAt(0) || "").toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-sm font-medium text-gray-900 truncate">{`${user.first_name || ""} ${user.last_name || ""}`}</div>{" "}
          {/* Додано прізвище, truncate, обробку null */}
        </div>
      ),
    },
    {
      header: "Email",
      key: "email",
      width: "25%",
      render: (user: User) => (
        <span className="text-sm text-gray-600">{user.email}</span>
      ),
    }, // Додано стиль
    {
      header: "Роль",
      key: "role",
      width: "15%",
      render: (user: User) => (
        <StatusBadge
          status={user.role || "customer"}
          config={userRoleStatusConfig}
        /> // Додано fallback роль
      ),
    },
    {
      header: "Дії",
      key: "actions",
      width: "20%", // Змінено ширину
      render: (user: User) => (
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

  const userFormFields: FormField<UpdateUser>[] = [
    {
      name: "first_name",
      label: "Ім'я",
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
      name: "last_name",
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
    {
      name: "phone_number",
      label: "Номер телефону",
      type: "tel",
      validation: {
        // required: "Номер телефону обов'язковий", // Можна зробити необов'язковим
        pattern: {
          value: /^\+?3?8?(0\d{9})$/,
          message:
            "Неправильний формат номеру (приклад: +380991234567 або 0991234567)",
        },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      validation: {
        required: "Email обов'язковий",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Невірний формат email",
        },
      },
    },

    {
      name: "role",
      label: "Роль",
      type: "select",
      options: [
        { value: "customer", label: "Користувач" }, // Порядок може мати значення
        { value: "admin", label: "Адміністратор" },
      ],
      validation: { required: "Роль обов'язкова" },
    },
    // Можливо, краще мати окрему логіку або модальне вікно для створення.
    {
      name: "password_hash", // Потрібно додати в тип CreateUser
      label: "Пароль",
      type: "password",
      validation: { required: "Пароль обов'язковий при створенні" },

      // Потрібна умовна валідація
    },
    // {
    //   name: "avatar_url",
    //   label: "Аватар користувача",
    //   type: "file",
    //   multiple: true,
    //   accept: "image/*",
    // },
  ];

  const renderUserUpdateForm = useCallback(
    (user: User) => (
      <GenericForm<UpdateUser>
        key={`update-form-${user.id}`} // Ключ для переініціалізації
        // Передаємо дані користувача, приводимо до типу форми UpdateUser
        // Припускаємо, що UpdateUser є підмножиною User або GenericForm ігнорує зайві поля
        defaultValues={user as UpdateUser}
        fields={userFormFields}
        onSubmit={(data) => handleUpdateSubmit(user.id, data)}
        title={`Редагування: ${user.first_name} ${user.last_name}`}
        submitLabel="Оновити користувача"
        className="border-t pt-4 mt-2"
      />
    ),
    [userFormFields, handleUpdateSubmit],
  ); // Додано залежності

  // --- Рендеринг компонента ---
  return (
    <div className="p-4 mx-auto max-w-7xl">
      {" "}
      {/* Обмежено ширину */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Управління користувачами
        </h1>
        {!showCreateForm && (
          <button
            onClick={() => {
              setShowCreateForm(true);
              // setExpandedRows([]); // Закриваємо редагування
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition duration-150 ease-in-out" // Змінено колір
          >
            + Додати користувача
          </button>
        )}
      </div>
      {/* --- Форма СТВОРЕННЯ (якщо активна) --- */}
      {showCreateForm && (
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-md">
          <GenericForm<UpdateUser> // Використовуємо той же тип форми
            key="create-user-form"
            defaultValues={initialUserValues as UpdateUser} // Порожні значення
            fields={userFormFields} // Той же набір полів (без пароля!)
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
      {/* --- Таблиця користувачів --- */}
      <GenericTable<User> // Вказуємо тип даних для таблиці
        // Переконуємось, що передаємо масив користувачів, а не весь об'єкт відповіді
        data={usersResponse || []} // Якщо useUsers повертає безпосередньо масив
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
