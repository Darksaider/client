// src/components/ImageUploadForm.tsx
import React, { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios"; // Імпортуємо axios

// Тип для відповіді від бекенду (залишаємо той самий)
interface UploadResponse {
  success: boolean;
  message: string;
  results?: any[];
  errors?: any[];
  url?: string;
}

// Тип для помилки Axios (для кращої обробки)
interface AxiosUploadErrorData {
  success: boolean;
  message: string;
  errors?: any[];
}

export const ImageUploadForm: React.FC = () => {
  const [uploadMode, setUploadMode] = useState<"single" | "multiple">("single");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<UploadResponse | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Обробник зміни режиму (без змін) ---
  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value as "single" | "multiple";
    setUploadMode(newMode);
    setSelectedFile(null);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- Обробник зміни файлів в інпуті (без змін) ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadStatus(null);
    const files = event.target.files;

    if (!files || files.length === 0) {
      setSelectedFile(null);
      setSelectedFiles([]);
      setPreviewUrls([]);
      return;
    }

    const fileArray = Array.from(files);
    const currentPreviewUrls: string[] = [];

    fileArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        console.warn(`Файл "${file.name}" не є зображенням.`);
        return;
      }
      currentPreviewUrls.push(URL.createObjectURL(file));
    });

    if (uploadMode === "single") {
      const firstImageFile = fileArray.find((f) => f.type.startsWith("image/"));
      setSelectedFile(firstImageFile || null);
      setPreviewUrls(
        firstImageFile ? [URL.createObjectURL(firstImageFile)] : [],
      );
      setSelectedFiles([]);
    } else {
      const imageFiles = fileArray.filter((f) => f.type.startsWith("image/"));
      setSelectedFiles(imageFiles);
      setPreviewUrls(imageFiles.map((file) => URL.createObjectURL(file)));
      setSelectedFile(null);
    }
  };

  // --- Очищення Object URL (без змін) ---
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // --- Обробник відправки форми (змінено на Axios) ---
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadStatus(null);

    if (uploadMode === "single" && !selectedFile) {
      setUploadStatus({
        success: false,
        message: "Будь ласка, виберіть файл для завантаження.",
      });
      return;
    }
    if (uploadMode === "multiple" && selectedFiles.length === 0) {
      setUploadStatus({
        success: false,
        message: "Будь ласка, виберіть файли для завантаження.",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    // Для Create React App:
    // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    // ... всередині handleSubmit ...
    let url = "";

    if (uploadMode === "single" && selectedFile) {
      url = `${API_BASE_URL}/upload/single`;

      formData.append("image", selectedFile);
    } else if (uploadMode === "multiple" && selectedFiles.length > 0) {
      url = "/upload/multiple"; // Переконайтеся, що це правильний URL для
      url = `${API_BASE_URL}/upload/multiple`;
      // вашого API
      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      setIsLoading(false);
      return;
    }

    try {
      // Використовуємо axios.post
      // Axios автоматично встановлює правильний Content-Type для FormData
      const response = await axios.post<UploadResponse>(url, formData, {
        // Тут можна додати конфігурацію Axios, наприклад, для прогресу завантаження
        // onUploadProgress: (progressEvent) => {
        //   if (progressEvent.total) {
        //       const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //       console.log(`Upload Progress: ${percentCompleted}%`);
        //   }
        // }
      });

      // Дані відповіді знаходяться у response.data
      const result = response.data;
      setUploadStatus(result);
      console.log("Результат завантаження (axios):", result);

      // Очистка після успішного завантаження
      if (result.success) {
        setSelectedFile(null);
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Помилка під час відправки запиту (axios):", error);

      let errorMessage = "Не вдалося відправити запит.";
      let errorDetails: any[] | undefined = undefined;

      // Обробляємо помилку Axios
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<AxiosUploadErrorData>; // Вказуємо тип даних помилки
        if (axiosError.response) {
          // Якщо сервер повернув відповідь з помилкою (статус не 2xx)
          console.error("Дані помилки:", axiosError.response.data);
          console.error("Статус помилки:", axiosError.response.status);
          // Використовуємо повідомлення з відповіді сервера, якщо воно є
          errorMessage =
            axiosError.response.data?.message ||
            `Помилка сервера: ${axiosError.response.status}`;
          errorDetails = axiosError.response.data?.errors; // Зберігаємо деталі помилок, якщо є
        } else if (axiosError.request) {
          // Запит було зроблено, але відповідь не отримана
          errorMessage = "Не вдалося отримати відповідь від сервера.";
        } else {
          // Помилка на етапі налаштування запиту
          errorMessage = axiosError.message;
        }
      } else if (error instanceof Error) {
        // Інші типи помилок (наприклад, помилки JavaScript перед відправкою)
        errorMessage = error.message;
      }

      setUploadStatus({
        success: false,
        message: errorMessage,
        errors: errorDetails,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Стилі (без змін) ---
  const inputStyle =
    "block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2";
  const buttonStyle = `px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed`;
  const radioLabelStyle = "mr-4 flex items-center";
  const radioInputStyle = "mr-1";

  return (
    // --- JSX розмітка форми (без змін) ---
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Завантажити зображення</h2>

      <div className="mb-4">
        <span className="mr-4 font-medium">Режим:</span>
        <label className={radioLabelStyle}>
          <input
            type="radio"
            name="uploadMode"
            value="single"
            checked={uploadMode === "single"}
            onChange={handleModeChange}
            className={radioInputStyle}
            disabled={isLoading}
          />
          Одне фото
        </label>
        <label className={radioLabelStyle}>
          <input
            type="radio"
            name="uploadMode"
            value="multiple"
            checked={uploadMode === "multiple"}
            onChange={handleModeChange}
            className={radioInputStyle}
            disabled={isLoading}
          />
          Кілька фото
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="fileInput"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {uploadMode === "single" ? "Виберіть файл:" : "Виберіть файли:"}
          </label>
          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            accept="image/*"
            multiple={uploadMode === "multiple"}
            onChange={handleFileChange}
            className={inputStyle}
            disabled={isLoading}
            key={uploadMode}
          />
        </div>

        {previewUrls.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Прев'ю ${index + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button type="submit" className={buttonStyle} disabled={isLoading}>
            {isLoading ? "Завантаження..." : "Завантажити"}
          </button>
          {isLoading && <div className="text-sm text-gray-500">Обробка...</div>}
        </div>
      </form>

      {uploadStatus && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            uploadStatus.success
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <p>{uploadStatus.message}</p>
          {uploadStatus.errors && uploadStatus.errors.length > 0 && (
            <ul className="list-disc list-inside mt-2">
              {uploadStatus.errors.map((err, index) => (
                <li key={index}>
                  {err.filename ? `${err.filename}: ${err.error}` : err.error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
