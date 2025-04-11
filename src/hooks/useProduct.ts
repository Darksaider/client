import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiResponse } from "../types/product.type";
import { useQueryString } from "./useQueryString";

const fetchProducts = async (params?: string | null): Promise<ApiResponse> => {
  const env = import.meta.env.VITE_API_URL;
  const url = `${env}/product?${params}`;
  try {
    const response = await axios.get<ApiResponse>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useProducts = () => {
  const params = useQueryString();

  return useQuery({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
    staleTime: 0,
    placeholderData: keepPreviousData,

    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
