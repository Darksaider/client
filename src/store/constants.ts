export const FreShipping = 2000; // Free shipping threshold in UAH
export const ITEMS_PER_PAGE = 12; // Items per page for pagination
export const SIBLING_COUNT = 1; // Number of sibling pages to show in pagination
export const ELLIPSIS: string = "...";
// -----------------------------
export const SORT_BY_OPTIONS = [
  { value: "newest", label: "Новизною" },
  { value: "popular", label: "Популярністю" },
  { value: "price_asc", label: "Ціною (від низької до високої)" },
  { value: "price_desc", label: "Ціною (від високої до низької)" },
  { value: "id_desc", label: "ID (від високого до низького)" },
];

export const ORDER_STATUS = {
  Pending: "pending",
  Confirmed: "confirmed",
  Shipped: "shipped",
  Delivered: "delivered",
  Cancelled: "cancelled",
  Returned: "returned",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  Awaiting: "awaiting",
  Completed: "completed",
  Failed: "failed",
  Expired: "expired",
  Refunded: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
