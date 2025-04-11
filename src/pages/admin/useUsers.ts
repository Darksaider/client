import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const getDataUsers = async () => {
  const response = await axios.get("http://localhost:3000/users");

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
