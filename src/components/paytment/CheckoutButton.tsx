// src/components/CheckoutButton.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { createCheckoutSession } from "./stripeApi";

interface CheckoutButtonProps {
  orderId: number;
  userId: number;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  orderId,
  userId,
  className = "",
  onSuccess,
  onError,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession(orderId, userId);

      // Якщо платіжна система повернула URL, перенаправляємо користувача
      if (url) {
        window.location.href = url;
        onSuccess?.();
      }
    } catch (error) {
      console.error("Помилка оплати:", error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`checkout-button ${className} ${loading ? "loading" : ""}`}
    >
      {loading ? "Підготовка оплати..." : "Оплатити зараз"}
    </button>
  );
};

export default CheckoutButton;
