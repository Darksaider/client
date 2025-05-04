import { useEffect, useState, useCallback } from "react";
import { UseFormRegister, Controller, Control } from "react-hook-form";

// Define types
type City = {
  Description: string;
  Ref: string;
  AreaDescription?: string;
};

type Warehouse = {
  Description: string;
  Ref: string;
  Number?: string;
  TypeOfWarehouse?: string;
  Phone?: string;
};

// API response types
type ApiResponse<T> = {
  success: boolean;
  data: T[];
  errors?: string[];
  warnings?: string[];
};

// Форма для замовлення
type OrderFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
  notes: string;
};

interface NovaPoshtaBranchSelectorProps {
  register: UseFormRegister<OrderFormData>;
  control: Control<OrderFormData>;
  setValue: (name: keyof OrderFormData, value: string) => void;
}

export function NovaPoshtaBranchSelector({
  register,
  control,
  setValue,
}: NovaPoshtaBranchSelectorProps) {
  // State management
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedCityRef, setSelectedCityRef] = useState<string | null>(null);

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehouseError, setWarehouseError] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );
  const [selectedWarehouseRef, setSelectedWarehouseRef] = useState<
    string | null
  >(null);

  // Filter options
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState("");

  // API key stored in a constant
  const API_KEY = "571680012bcd74737add907829af1ff1"; // 🔒 Replace with your actual key
  const API_URL = "https://api.novaposhta.ua/v2.0/json/";

  // Fetch cities based on search query
  const fetchCities = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setCities([]);
        return;
      }

      setCityLoading(true);
      setCityError(null);

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: API_KEY,
            modelName: "Address",
            calledMethod: "getCities",
            methodProperties: {
              FindByString: query,
              Limit: 20,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Network response failed");
        }

        const result: ApiResponse<City> = await response.json();

        if (!result.success) {
          throw new Error(result.errors?.join(", ") || "API request failed");
        }

        setCities(result.data || []);
      } catch (error) {
        setCityError(
          error instanceof Error ? error.message : "Failed to load cities",
        );
        setCities([]);
      } finally {
        setCityLoading(false);
      }
    },
    [API_KEY],
  );

  // Fetch warehouses based on selected city
  const fetchWarehouses = useCallback(
    async (cityRef: string) => {
      if (!cityRef) return;

      setWarehouseLoading(true);
      setWarehouseError(null);

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: API_KEY,
            modelName: "AddressGeneral",
            calledMethod: "getWarehouses",
            methodProperties: {
              CityRef: cityRef,
            },
          }),
        });

        if (!response.ok) {
          throw new Error("Network response failed");
        }

        const result: ApiResponse<Warehouse> = await response.json();

        if (!result.success) {
          throw new Error(result.errors?.join(", ") || "API request failed");
        }

        setWarehouses(result.data || []);
      } catch (error) {
        setWarehouseError(
          error instanceof Error ? error.message : "Failed to load warehouses",
        );
        setWarehouses([]);
      } finally {
        setWarehouseLoading(false);
      }
    },
    [API_KEY],
  );

  // City search debounce effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (cityQuery.trim()) {
        fetchCities(cityQuery);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeout);
  }, [cityQuery, fetchCities]);

  // Fetch warehouses when city selection changes
  useEffect(() => {
    if (selectedCityRef) {
      fetchWarehouses(selectedCityRef);
      // Reset warehouse selection when city changes
      setSelectedWarehouse(null);
      setSelectedWarehouseRef(null);
      setWarehouseSearchQuery("");
    }
  }, [selectedCityRef, fetchWarehouses]);

  // Handle city selection
  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSelectedCityRef(city.Ref);
    setCityQuery(city.Description);
    setCities([]);

    // Update react-hook-form
    setValue("city", city.Description);
  };

  // Handle warehouse selection with dropdown closing
  const handleWarehouseSelect = (ref: string) => {
    if (!ref) {
      setSelectedWarehouse(null);
      setSelectedWarehouseRef(null);
      setValue("address", "");
      return;
    }

    const selected = warehouses.find((wh) => wh.Ref === ref) || null;
    setSelectedWarehouse(selected);
    setSelectedWarehouseRef(ref);

    // Update react-hook-form with formatted warehouse address
    if (selected) {
      setValue("address", formatWarehouseName(selected));
    }
  };

  // Filter warehouses based on search
  const filteredWarehouses = warehouses
    .filter((wh) => {
      return (
        !warehouseSearchQuery ||
        wh.Description.toLowerCase().includes(
          warehouseSearchQuery.toLowerCase(),
        ) ||
        (wh.Number &&
          wh.Number.toLowerCase().includes(warehouseSearchQuery.toLowerCase()))
      );
    })
    .sort((a, b) => {
      // Сортування за номером відділення, якщо є
      const numA = a.Number ? parseInt(a.Number, 10) : Infinity;
      const numB = b.Number ? parseInt(b.Number, 10) : Infinity;
      return numA - numB;
    });

  // Reset form
  const handleReset = () => {
    setCityQuery("");
    setSelectedCity(null);
    setSelectedCityRef(null);
    setWarehouses([]);
    setSelectedWarehouse(null);
    setSelectedWarehouseRef(null);
    setWarehouseSearchQuery("");

    // Clear react-hook-form values
    setValue("city", "");
    setValue("address", "");
  };

  // Format warehouse name for display
  const formatWarehouseName = (warehouse: Warehouse) => {
    return `${warehouse.Description}${warehouse.Number ? ` №${warehouse.Number}` : ""}`;
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
        Доставка Новою Поштою
      </h3>

      {/* Hidden inputs for react-hook-form */}
      <input type="hidden" {...register("city")} />
      <input type="hidden" {...register("address")} />

      {/* City selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Місто*
        </label>
        <div className="relative">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder="Почніть вводити назву міста (мін. 2 символи)"
            className="border border-gray-300 px-4 py-2 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />

          {cityLoading && (
            <div className="absolute right-3 top-2.5">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {cities.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
              {cities.map((city) => (
                <li
                  key={city.Ref}
                  onClick={() => handleCitySelect(city)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium">{city.Description}</div>
                  {city.AreaDescription && (
                    <div className="text-sm text-gray-500">
                      {city.AreaDescription}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {cityError && <p className="text-red-500 text-sm">{cityError}</p>}
      </div>

      {selectedCityRef && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700">
              Відділення у місті {selectedCity?.Description}
            </h3>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Змінити місто
            </button>
          </div>

          {warehouseLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : warehouseError ? (
            <p className="text-red-500">{warehouseError}</p>
          ) : (
            <>
              {/* Warehouse search */}
              <div className="flex">
                <input
                  type="text"
                  value={warehouseSearchQuery}
                  onChange={(e) => setWarehouseSearchQuery(e.target.value)}
                  placeholder="Пошук за номером або адресою"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm"
                />
              </div>

              {/* Selected warehouse display or dropdown */}
              {selectedWarehouse ? (
                <div className="border border-gray-300 rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {formatWarehouseName(selectedWarehouse)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedWarehouse(null);
                        setValue("address", "");
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Змінити
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Warehouse list when nothing is selected */}
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <ul className="max-h-60 overflow-y-auto">
                      {filteredWarehouses.length === 0 ? (
                        <li className="px-3 py-2 text-gray-500">
                          Немає відділень за заданими критеріями
                        </li>
                      ) : (
                        filteredWarehouses.map((wh) => (
                          <li
                            key={wh.Ref}
                            onClick={() => handleWarehouseSelect(wh.Ref)}
                            className="px-3 py-2 border-b border-gray-200 last:border-0 cursor-pointer hover:bg-blue-50"
                          >
                            {formatWarehouseName(wh)}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  <p className="text-sm text-gray-500">
                    {filteredWarehouses.length
                      ? `Знайдено ${filteredWarehouses.length} відділень`
                      : ""}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
