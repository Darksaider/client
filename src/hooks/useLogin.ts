import { useState, useEffect, useCallback } from "react";
import apiClient from "./apiClient";

// Тип для даних користувача, які ми зберігаємо/отримуємо
interface AuthUserData {
  role: string | null;
  email: string | null;
  id: string | null;
  // Можна додати інші поля, якщо потрібно, напр. email, id
}

// Тип для стану, який повертає хук
interface AuthState extends AuthUserData {
  isLoggedIn: boolean;
  isLoading: boolean; // Показує, чи йде початкова перевірка/завантаження
  login: (userData: AuthUserData) => void; // Функція для запису даних після логіну
  logout: () => Promise<void>; // Функція для виходу (може бути асинхронною, якщо викликає API)
  // Можна додати стан помилки error, якщо потрібно
}

// Назви ключів у localStorage
const LOCAL_STORAGE_KEYS = {
  isLoggedIn: "isLoggedIn",
  userRole: "userRole",
  userEmail: "userEmail",
  userId: "userId",
};

export function useAuth(): AuthState {
  // --- Стан хука ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Починаємо зі стану завантаження

  // --- Ефект для ініціалізації стану з localStorage та верифікації ---
  useEffect(() => {
    // 1. Спробувати прочитати дані з localStorage
    const storedIsLoggedIn =
      localStorage.getItem(LOCAL_STORAGE_KEYS.isLoggedIn) === "true";
    const storedRole = localStorage.getItem(LOCAL_STORAGE_KEYS.userRole);
    const storedUserEmail = localStorage.getItem(LOCAL_STORAGE_KEYS.userEmail);
    const storedUserId = localStorage.getItem(LOCAL_STORAGE_KEYS.userId);

    // 2. Оновити стан для миттєвого відображення UI
    // Навіть якщо токен не валідний, ми тимчасово покажемо дані,
    // щоб уникнути "миготіння" UI. Потім верифікація виправить стан.
    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUserRole(storedRole);
      setUserEmail(storedUserEmail);
      setUserId(storedUserId);
    }

    // 3. Верифікувати стан на сервері (перевірити HttpOnly cookie)
    const verifySession = async () => {
      setIsLoading(true); // Починаємо завантаження/перевірку
      try {
        // Робимо запит до ендпоінту, який перевіряє токен з cookie
        // і повертає дані користувача, якщо токен валідний
        const response = await apiClient.get<{
          id: number;
          role: string;
          email: string;
        }>("/me"); // Або /api/auth/status

        // Якщо запит успішний (токен валідний)
        const serverUserData = response.data;
        setIsLoggedIn(true);
        setUserRole(serverUserData.role);
        setUserEmail(serverUserData.email);
        setUserId(serverUserData.id.toString());

        // Оновити localStorage на випадок, якщо дані змінилися
        localStorage.setItem(LOCAL_STORAGE_KEYS.isLoggedIn, "true");
        localStorage.setItem(LOCAL_STORAGE_KEYS.userRole, serverUserData.role);
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.userEmail,
          serverUserData.email,
        );
      } catch (error) {
        // Якщо сервер повернув помилку (напр., 401 Unauthorized - токен невалідний)
        console.error("Session verification failed:", error);
        // Очистити стан і localStorage
        setIsLoggedIn(false);
        setUserRole(null);
        setUserEmail(null);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.isLoggedIn);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.userRole);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.userEmail);
      } finally {
        setIsLoading(false); // Завершуємо завантаження/перевірку
      }
    };

    verifySession();

    // Ефект виконується тільки один раз при монтуванні
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Пустий масив залежностей

  // --- Функція для обробки логіну ---
  // Цю функцію слід викликати після успішного запиту на логін до API,
  // передавши дані користувача, отримані від сервера
  const login = useCallback((userData: AuthUserData) => {
    setIsLoading(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.isLoggedIn, "true");
      if (userData.role)
        localStorage.setItem(LOCAL_STORAGE_KEYS.userRole, userData.role);
      if (userData.email)
        localStorage.setItem(LOCAL_STORAGE_KEYS.userEmail, userData.email);

      setIsLoggedIn(true);
      setUserRole(userData.role);
      setUserEmail(userData.email);
      setUserEmail(userData.id);
    } catch (error) {
      console.error("Failed to save auth state to localStorage:", error);
      // Тут можна обробити помилку, якщо localStorage недоступний
    } finally {
      setIsLoading(false);
    }
  }, []); // Залежностей немає, бо використовуємо тільки set-функції

  // --- Функція для обробки виходу ---
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. (Опціонально) Повідомити бекенд про вихід, щоб він міг,
      // наприклад, очистити HttpOnly cookie або інвалідувати сесію, якщо він stateful
      // await apiClient.post('/api/logout');

      // 2. Очистити localStorage
      localStorage.removeItem(LOCAL_STORAGE_KEYS.isLoggedIn);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.userRole);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.userEmail);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.userId);

      // 3. Очистити стан
      setIsLoggedIn(false);
      setUserRole(null);
      setUserEmail(null);
    } catch (error) {
      console.error("Logout failed:", error);
      // Можна показати помилку користувачу
    } finally {
      setIsLoading(false);
    }
  }, []); // Залежностей немає

  // Повертаємо стан та функції для використання в компонентах
  return {
    isLoggedIn,
    role: userRole,
    email: userEmail,
    id: userId,
    isLoading,
    login,
    logout,
  };
}
