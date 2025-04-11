import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ProductItem } from "../types/product.type";

const fetchProduct = async (id: number): Promise<ProductItem> => {
  const env = import.meta.env.VITE_API_URL;
  const url = `${env}/product/${id}`;

  try {
    const response = await axios.get<ProductItem>(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching product with ID:", id, error); // Додали більше інформації про помилку
    throw error;
  }
};

export const useProductItem = (id: number) => {
  return useQuery({
    queryKey: ["productItem", id],
    queryFn: () => fetchProduct(id),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
