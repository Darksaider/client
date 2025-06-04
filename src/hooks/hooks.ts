import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { IFilterResponse } from "../types/types";
import {
  Brand,
  Category,
  Color,
  Discount,
  Size,
} from "../pages/admin/admin.type";
const apiUrlBase = import.meta.env.VITE_API_URL;
interface Review {
  id: number;
  user_id: number;
  product_id: number;
  text: string;
  rating: number;
  created_at: string;
  updated_at: string;
  user: User;
}
interface User {
  id: number;
  first_name: string;
  email: string;
}

const getDataDiscounts = async () => {
  const response = await axios.get<IFilterResponse<Discount[]>>(
    `${apiUrlBase}/discount`,
  );
  return response.data.data;
};
const getDataComents = async (productId: number) => {
  let zapros = `${apiUrlBase}/comments/${productId}`;
  console.log(zapros);

  // if (!productId) zapros = `${apiUrlBase}/comments`;
  const response = await axios.get<IFilterResponse<Review[]>>(zapros);
  return response.data.data;
};
const getDataSizes = async () => {
  const response = await axios.get<IFilterResponse<Size[]>>(
    `${apiUrlBase}/sizes`,
  );
  return response.data.data;
};
const getDataCategories = async () => {
  const response = await axios.get<IFilterResponse<Category[]>>(
    `${apiUrlBase}/categories`,
  );
  return response.data.data;
};
const getDataColors = async () => {
  const response = await axios.get<IFilterResponse<Color[]>>(
    `${apiUrlBase}/colors`,
  );
  return response.data.data;
};
const getDataBrands = async () => {
  const response = await axios.get<IFilterResponse<Brand[]>>(
    `${apiUrlBase}/brands`,
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
export function useBrands(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getDataBrands(),
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
export function useSizes(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getDataSizes(),
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
export function useComments(productid?: number) {
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getDataComents(productid ? productid : 0),
    select: (data) => data,
    enabled: typeof productid === "number",
  });
  useEffect(() => {
    if (isSuccess) console.log("Data fetched successfully");
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, error, isError, isLoading, isSuccess, refetch };
}
