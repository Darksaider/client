import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { IDiscounts, IFilterResponse } from "../../../types/types";
import { Discount } from "../admin.type";
const apiUrlBase = import.meta.env.VITE_API_URL;

const getDataDiscounts = async () => {
  const response = await axios.get<IFilterResponse<Discount[]>>(
    `${apiUrlBase}/discount`,
  );
  return response.data.data;
};
const getDataCategories = async () => {
  const response = await axios.get<IFilterResponse<Discount[]>>(
    `${apiUrlBase}/categories`,
  );
  return response.data.data;
};
const getDataColors = async () => {
  const response = await axios.get<IFilterResponse<Discount[]>>(
    `${apiUrlBase}/colors`,
  );
  return response.data.data;
};
export function useDiscounts(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["discounts"],
    queryFn: () => getDataDiscounts(),
    select: (data) => data,
    enabled: isEnabled,
  });
  useEffect(() => {
    if (isSuccess) console.log("Data fetched successfully");
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, error, isError, isLoading, isSuccess, refetch };
}
export function useCategories(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getDataCategories(),
    select: (data) => data,
    enabled: isEnabled,
  });
  useEffect(() => {
    if (isSuccess) console.log("Data fetched successfully");
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, error, isError, isLoading, isSuccess, refetch };
}
export function useColors(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["colors"],
    queryFn: () => getDataColors(),
    select: (data) => data,
    enabled: isEnabled,
  });
  useEffect(() => {
    if (isSuccess) console.log("Data fetched successfully");
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, error, isError, isLoading, isSuccess, refetch };
}
