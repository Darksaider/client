import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse, ProductsType } from "../types/product.type";
import { useQueryString } from "./useQueryString";

const fetchProducts = async (
  params?: string | undefined,
): Promise<ProductsType> => {
  const env = import.meta.env.VITE_API_URL;
  const url = `${env}/product?${params}`;
  try {
    const response = await axios.get<ApiResponse>(url);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
type Params = {
  hasDiscount?: boolean;
};

export const useProducts = (str?: string) => {
  const paramsFromQuery = useQueryString(); // наприклад { category: "shoes", page: "2" }
  const combinedParams = str ? paramsFromQuery + `${str}` : paramsFromQuery;

  return useQuery<ProductsType>({
    queryKey: ["products", combinedParams],
    queryFn: () => fetchProducts(combinedParams),
    staleTime: 1000 * 60 * 2,
    // staleTime: 0,

    // Ця опція чудово працює з кешуванням. Вона показує старі дані,
    // поки завантажуються нові (наприклад, при зміні сторінки пагінації).
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
