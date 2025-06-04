import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { IFilterResponse } from "../types/types";
import apiClient from "./apiClient";
import { Size } from "../pages/admin/admin.type";

const getDataOrders = async () => {
  const response = await apiClient.get<IFilterResponse<Size[]>>(`/orders`);
  return response.data;
};
export function useOrders(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getDataOrders(),
    select: (data) => data,
    enabled: isEnabled,
  });
  // useEffect(() => {
  //   if (isSuccess) console.log("Data fetched successfully");
  // }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);
  // export const useProductFavorite = (productId) => {
  // const { data: itemFavorites, refetch } = useFavorites(true);

  // Перевірка наявності товару в улюблених

  // Функція для додавання/видалення товару з улюблених

  return {
    data,
    isError,
    isLoading,
    isSuccess,
    refetch,
  };
  // };
}
