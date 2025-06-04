import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import apiClient from "./apiClient";
import { User } from "../pages/admin/admin.type";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
const getDataUsers = async () => {
  const response = await apiClient.get("/users");

  return response.data.data;
};
const getDataUser = async () => {
  const response = await apiClient.get<ApiResponse<User>>(`/users/account`);

  return response.data.data;
};
export function useUsers(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => getDataUsers(),
    enabled: isEnabled,
  });
  useEffect(() => {
    if (isSuccess) console.log("Data fetched successfully");
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, isError, isLoading, isSuccess, refetch };
}
export function useUser(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => getDataUser(),
    enabled: isEnabled,
  });
  useEffect(() => {
    if (isSuccess) console.log("Data fetched successfully");
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, isError, isLoading, isSuccess, refetch };
}
