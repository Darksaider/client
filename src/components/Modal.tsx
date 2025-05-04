// components/Modal.tsx (Універсальний)
import React, { useEffect, ReactNode } from "react";

interface ModalProps {
  children: ReactNode; // Вміст, який буде рендеритися всередині
  onClose: () => void; // Функція закриття
  // Додатковий проп для класів бекдропу, якщо потрібна кастомізація
  backdropClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  // Задаємо клас бекдропу за замовчуванням, але дозволяємо його змінити
  backdropClassName = "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4", // Використовуємо /60 для кращого контрасту
}) => {
  // Обробник кліку на фоні (бекдропі)
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Закриваємо тільки якщо клік був саме на бекдропі, а не на дочірніх елементах
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Обробник натискання Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    // Очищення слухача при розмонтуванні
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]); // Залежність тільки від onClose

  return (
    // Бекдроп - відповідає ТІЛЬКИ за фон, позиціонування і логіку закриття
    <div
      className={backdropClassName} // Використовуємо переданий або дефолтний клас
      onClick={handleBackdropClick}
    >
      {/*
        Рендеримо дочірні елементи НАПРЯМУ.
        Тепер компонент, що ВИКОРИСТОВУЄ Modal (напр. Cart),
        повністю відповідає за стилізацію дітей:
        - Фон дітей (bg-white, dark:bg-gray-800)
        - Падінги дітей (p-4, p-6)
        - Тінь дітей (shadow-xl)
        - Заокруглення дітей (rounded-lg)
        - Розміри дітей (w-full, max-w-*, h-*)
        - Внутрішню структуру (flex, grid)
        - Власну кнопку закриття (якщо потрібна)
        - Зупинку спливання подій (onClick={e => e.stopPropagation()}) на своєму кореневому елементі
      */}
      {children}
    </div>
  );
};
