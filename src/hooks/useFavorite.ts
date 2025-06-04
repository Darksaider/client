import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IFilterResponse } from "../types/types";
import { Favorite } from "../pages/admin/admin.type";
import apiClient from "./apiClient";

const getDataFavorites = async () => {
  const response =
    await apiClient.get<IFilterResponse<Favorite[]>>("/favorites");
  return response.data.data;
};
export function useFavorites(isEnabled: boolean, productId: number) {
  const { data, isError, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => getDataFavorites(),
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
  const [isInFavorites, setIsInFavorites] = useState(false);
  // const { data: itemFavorites, refetch } = useFavorites(true);

  // Перевірка наявності товару в улюблених
  useEffect(() => {
    const isFavorite =
      data?.some((item) => item.product_id === productId) ?? false;
    setIsInFavorites(isFavorite);
  }, [productId, data]);

  // Функція для додавання/видалення товару з улюблених
  const toggleFavorite = async () => {
    try {
      if (isInFavorites) {
        await apiClient.delete(`/favorites/${productId}`);
      } else {
        await apiClient.post("/favorites", { id: productId });
      }
      refetch();
    } catch (error) {
      console.error("Error managing favorite", error);
    }
  };

  return {
    isInFavorites,
    toggleFavorite,
    data,
    isError,
    isLoading,
    isSuccess,
    refetch,
  };
  // };
}
