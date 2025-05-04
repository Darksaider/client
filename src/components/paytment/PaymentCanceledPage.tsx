import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { getPaymentStatus, PaymentStatus } from "./stripeApi";

const PaymentCanceledPage: React.FC = () => {
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
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="loading-spinner w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-lg font-medium text-gray-700">
          Перевірка статусу замовлення...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Платіж скасовано
          </h1>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {error ? (
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-700">
                  Ваш платіж було скасовано. З вашої картки не знято кошти.
                </p>
              </div>

              {paymentStatus && (
                <div className="bg-gray-50 rounded-md p-4 mb-6">
                  <div className="text-sm text-gray-700">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-gray-500">Номер замовлення:</div>
                      <div className="font-medium text-gray-900">
                        #{paymentStatus.orderId}
                      </div>
                      <div className="text-gray-500">Статус:</div>
                      <div className="font-medium text-gray-900">
                        {paymentStatus.orderStatus}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
            <p className="text-sm text-blue-700">
              Товари залишаються у вашому кошику, і ви можете завершити покупку
              пізніше.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/checkout"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Повернутися до оформлення
            </Link>
            <Link
              to="/cart"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Перейти до кошика
            </Link>
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 text-sm font-medium text-blue-600 bg-transparent hover:text-blue-800 hover:bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              На головну
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCanceledPage;
