import { useQuery } from "@tanstack/react-query";
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
  return {
    data,
    isError,
    isLoading,
    isSuccess,
    refetch,
  };
}
