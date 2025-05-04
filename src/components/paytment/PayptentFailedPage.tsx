import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { getPaymentStatus, PaymentStatus } from "./stripeApi";

const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const errorCode = searchParams.get("error_code");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
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

  const getErrorMessage = () => {
    if (errorCode === "card_declined") {
      return "Вашу карту було відхилено. Будь ласка, перевірте дані картки або спробуйте іншу карту.";
    } else if (errorCode === "insufficient_funds") {
      return "На карті недостатньо коштів для здійснення платежу.";
    } else if (errorCode === "expired_card") {
      return "Термін дії карти закінчився. Будь ласка, використайте іншу карту.";
    } else {
      return "Під час обробки платежу сталася помилка. Будь ласка, спробуйте ще раз або зверніться до служби підтримки.";
    }
  };

  if (loading) return <div className="loading">Перевірка платежу...</div>;

  return (
    <div className="payment-result-page">
      <div className="failed-container">
        <div className="failed-icon">✗</div>
        <h1>Платіж не вдалося обробити</h1>

        <div className="error-info">
          <p>{getErrorMessage()}</p>

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
        </div>

        <div className="buttons">
          <Link to="/checkout" className="button primary">
            Спробувати ще раз
          </Link>
          <Link to="/cart" className="button secondary">
            Повернутися до кошика
          </Link>
          <Link to="/support" className="button tertiary">
            Зв'язатися з підтримкою
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
