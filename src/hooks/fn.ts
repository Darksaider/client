// Утиліта для форматування дати
export const formatDateForInput = (
  date: Date | string | null | undefined,
): string => {
  if (!date) return "";
  try {
    // Якщо це вже рядок YYYY-MM-DD, повертаємо його
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    const d = date instanceof Date ? date : new Date(date);
    // Перевірка на валідність дати
    if (isNaN(d.getTime())) {
      console.warn("Invalid date provided to formatDateForInput:", date);
      return "";
    }
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Місяці 0-11, додаємо 1
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", date, error);
    return ""; // Повертаємо порожній рядок у разі помилки
  }
};
