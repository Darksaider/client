// src/pages/PaymentSuccessPage.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { getPaymentStatus, PaymentStatus } from "./stripeApi";

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        // В реальності вам потрібно буде зробити API запит, щоб отримати
        // orderId за sessionId, або зберігати його в localStorage
        // Це спрощений приклад
        const orderId = localStorage.getItem("currentOrderId");

        if (orderId) {
          const status = await getPaymentStatus(parseInt(orderId));
          setPaymentStatus(status);
        } else {
          setError("Не вдалося знайти інформацію про замовлення");
        }
      } catch (err: any) {
        setError("Помилка отримання статусу платежу");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchOrderStatus();
    } else {
      setLoading(false);
      setError("Інформація про платіж відсутня");
    }
  }, [sessionId]);

  if (loading) return <div className="loading">Перевірка платежу...</div>;

  return (
    <div className="payment-result-page">
      {error ? (
        <div className="error-container">
          <h1>Помилка</h1>
          <p>{error}</p>
          <Link to="/orders" className="button">
            Перейти до замовлень
          </Link>
        </div>
      ) : (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h1>Дякуємо за ваше замовлення!</h1>

          {paymentStatus && (
            <div className="order-info">
              <p>
                Номер замовлення: <strong>#{paymentStatus.orderId}</strong>
              </p>
              <p>
                Статус: <strong>{paymentStatus.orderStatus}</strong>
              </p>
              <p>
                Статус оплати: <strong>{paymentStatus.paymentStatus}</strong>
              </p>
            </div>
          )}

          <p>
            Ваше замовлення успішно оплачено. Ми надішлемо вам електронного
            листа з підтвердженням та деталями замовлення.
          </p>

          <div className="buttons">
            <Link to="/orders" className="button primary">
              Мої замовлення
            </Link>
            <Link to="/" className="button secondary">
              На головну
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
