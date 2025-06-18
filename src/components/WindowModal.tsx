// components/Modal.tsx (Універсальний)
import React, { useEffect, ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  backdropClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  backdropClassName = "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4", // Використовуємо /60 для кращого контрасту
}) => {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

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
  }, [onClose]);

  return (
    <div
      className={backdropClassName} // Використовуємо переданий або дефолтний клас
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
};
