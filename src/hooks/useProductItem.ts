import { useQuery } from "@tanstack/react-query";
import { Product, ProductItem } from "../types/product.type";
import apiClient from "./apiClient";

const fetchProduct = async (id: number): Promise<Product> => {
  const env = import.meta.env.VITE_API_URL;
  const url = `${env}/product/${id}`;

  try {
    const response = await apiClient.get<ProductItem>(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product with ID:", id, error); // Додали більше інформації про помилку
    throw error;
  }
};

export const useProductItem = (id: number) => {
  return useQuery({
    queryKey: ["productItem", id],
    queryFn: () => fetchProduct(id),
    staleTime: 1000 * 60 * 2,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
