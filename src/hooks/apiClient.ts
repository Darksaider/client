// apiClient.ts
import axios from "axios";

// Створюємо екземпляр axios з базовими налаштуваннями
const apiClient = axios.create({
  // Вказуємо базовий URL вашого API
  baseURL: import.meta.env.VITE_API_URL,
  // Встановлюємо стандартні заголовки
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },

  // ВАЖЛИВО: Дозволяє надсилати та отримувати cookies
  // (включаючи HttpOnly) для запитів на той самий домен
  // або для cross-origin запитів, якщо бекенд налаштував CORS правильно
  withCredentials: true,

  // Можна встановити тайм-аут для запитів (в мілісекундах)
  // timeout: 10000,
});

// --- Опціонально: Перехоплювачі (Interceptors) ---
// Можна додати логіку, яка виконується перед кожним запитом або після кожної відповіді

// Приклад перехоплювача відповіді для централізованої обробки помилок
apiClient.interceptors.response.use(
  (response) => {
    // Якщо відповідь успішна (статус 2xx), просто повертаємо її дані
    return response;
  },
  (error) => {
    // Якщо сталася помилка
    console.error("API Error:", error.response || error.message || error);

    // Можна додати специфічну обробку помилок тут
    // Наприклад, якщо помилка 401 Unauthorized (токен невалідний),
    // можна автоматично викликати функцію logout або перенаправити на логін.
    // if (error.response && error.response.status === 401) {
    //   // Тут може бути логіка автоматичного виходу
    //   // Важливо робити це обережно, щоб не спричинити зациклення
    //   // window.location.href = '/login';
    // }

    // Важливо відхилити проміс, щоб помилку можна було обробити далі (в catch блоці хука useAuth)
    return Promise.reject(error);
  },
);

export default apiClient;
