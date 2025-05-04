import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { IFilterResponse } from "../types/types";
import { Favorite } from "../pages/admin/admin.type";
import apiClient from "./apiClient";

const getDataFavorites = async () => {
  const response =
    await apiClient.get<IFilterResponse<Favorite[]>>("/favorites");
  return response.data.data;
};
export function useFavorites(isEnabled: boolean) {
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

  return { data, isError, isLoading, isSuccess, refetch };
}
