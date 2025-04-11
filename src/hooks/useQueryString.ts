import { useSearchParams } from "react-router";

export function useQueryString(): string {
  const [searchParams] = useSearchParams();

  // const queryString = searchParams.toString();
  const entries = Array.from(searchParams.entries());

  // Формуємо декодований рядок параметрів
  const decodedParams = entries
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return decodedParams;
}
