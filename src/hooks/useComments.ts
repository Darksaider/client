import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Review } from "../pages/admin/admin.type";
import { IFilterResponse } from "../types/types";
import apiClient from "./apiClient";

const getDataComments = async (productId: number) => {
  const response = await apiClient.get<IFilterResponse<Review[]>>(
    `/comments/${productId}`,
  );
  return response.data.data;
};

export function useComments(productId?: number) {
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["comments", productId],
    queryFn: () => getDataComments(productId ? productId : 0),
    select: (data) => data,
    staleTime: 2 * 60 * 1000, // 5 хвилин
  });
  useEffect(() => {
    if (isSuccess) console.log("Data fetched successfully");
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, error, isError, isLoading, isSuccess, refetch };
}
