import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { IFilter, IFilterResponse } from "../types/types";

const getDataFilter = async () => {
  const response = await axios.get<IFilterResponse<IFilter>>(
    "http://localhost:3000/getAll",
  );
  return response.data.data;
};
export function useFilter(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["filter"],
    queryFn: () => getDataFilter(),
    select: (data) => data,
    enabled: isEnabled,
  });
  useEffect(() => {
    if (isSuccess) console.log("Data fetched successfully");
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, isError, isLoading, isSuccess };
}
