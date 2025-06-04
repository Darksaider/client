import React, { ReactNode, useEffect, useState, useCallback } from "react";
import {
  useForm,
  FieldValues,
  RegisterOptions,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import { formatDateForInput } from "../../../hooks/fn";

// Interface for existing images
interface ExistingImage {
  id: string | number; // Database ID of the image
  url: string; // URL for display
  name?: string; // Optional image name
  cloudinary_public_id: string; // Cloudinary public ID for deletion
}

// --- FormField Interface ---
export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type:
    | "text"
    | "email"
    | "select"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "checkbox"
    | "checkbox-group"
    | "date"
    | "file"; // "file" type for file uploads
  options?: Array<{ value: string | number; label: string }>;
  validation?: RegisterOptions<T>;
  preview?: (value: any) => ReactNode;
  multiple?: boolean; // For selecting multiple files
  accept?: string; // For restricting file types, e.g., "image/*"
  existingImages?: ExistingImage[]; // Added for existing images
}

// --- GenericFormProps Interface ---
interface GenericFormProps<T extends FieldValues> {
  defaultValues: T;
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
  title?: string;
  submitLabel?: string;
  className?: string;
}

// --- Component for previewing new images ---
interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

const FilePreview = ({ files, onRemove }: FilePreviewProps) => {
  return (
    <div className="mt-2 flex flex-wrap gap-4">
      {files.map((file, index) => (
        <div key={`new-${index}`} className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index}`}
            className="h-24 w-24 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
            aria-label="Видалити зображення"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// --- Component for displaying existing images ---
interface ExistingImagePreviewProps {
  images: ExistingImage[];
  onRemove: (cloudinaryPublicId: string) => void;
}

const ExistingImagePreview = ({
  images,
  onRemove,
}: ExistingImagePreviewProps) => {
  return (
    <div className="mt-2 flex flex-wrap gap-4">
      {images.map((image) => (
        <div key={`existing-${image.id}`} className="relative">
          <img
            src={image.url}
            alt={image.name || `Image ${image.id}`}
            className="h-24 w-24 object-cover rounded-md"
          />
          <button
            type="button"
            onClick={() => onRemove(image.cloudinary_public_id)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
            aria-label="Видалити зображення"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

// --- GenericForm Component ---
export function GenericForm<T extends FieldValues>({
  defaultValues,
  fields,
  onSubmit,
  title,
  submitLabel = "Зберегти",
  className = "border p-4 mb-4 rounded-lg bg-white shadow-sm",
}: GenericFormProps<T>) {
  const formMethods: UseFormReturn<T> = useForm<T>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = formMethods;

  const [checkboxGroupCheckedState, setCheckboxGroupCheckedState] = useState<
    Record<string, Set<string | number>>
  >({});

  // State for storing newly uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>(
    {},
  );

  // State for storing existing images (to be saved)
  const [existingImages, setExistingImages] = useState<
    Record<string, ExistingImage[]>
  >({});

  // State for storing cloudinary_public_ids of images to delete
  const [imagesToDelete, setImagesToDelete] = useState<
    Record<string, string[]>
  >({});

  // --- Handle defaultValues and initial state initialization for images ---
  useEffect(() => {
    const processedDefaults: Partial<T> = {};
    const initialCheckboxState: Record<string, Set<string | number>> = {};
    const initialExistingImages: Record<string, ExistingImage[]> = {};

    fields.forEach((field) => {
      const fieldName = field.name;
      const rawValueFromProduct = defaultValues[fieldName];

      // Initialize existing images if available
      if (
        field.type === "file" &&
        field.existingImages &&
        field.existingImages.length > 0
      ) {
        initialExistingImages[String(fieldName)] = [...field.existingImages];
      }

      if (field.type === "select") {
        if (
          fieldName === "product_brands" &&
          Array.isArray(rawValueFromProduct) &&
          rawValueFromProduct.length > 0
        ) {
          const brandId =
            rawValueFromProduct[0]?.brand_id ??
            rawValueFromProduct[0]?.brands?.id;
          if (brandId !== undefined) {
            processedDefaults[fieldName] = brandId as PathValue<T, Path<T>>;
          }
        } else if (
          fieldName === "product_discounts" &&
          Array.isArray(rawValueFromProduct) &&
          rawValueFromProduct.length > 0
        ) {
          const discountId =
            rawValueFromProduct[0]?.discount_id ??
            rawValueFromProduct[0]?.discounts?.id;
          if (discountId !== undefined) {
            processedDefaults[fieldName] = discountId as PathValue<T, Path<T>>;
          }
        } else if (
          typeof rawValueFromProduct === "string" ||
          typeof rawValueFromProduct === "number"
        ) {
          processedDefaults[fieldName] = rawValueFromProduct as PathValue<
            T,
            Path<T>
          >;
        }
      } else if (field.type === "checkbox-group") {
        // ... (logic for checkbox-group)
        let extractedIds: (string | number)[] = [];
        if (Array.isArray(rawValueFromProduct)) {
          let idKey: string | null = null;
          if (fieldName === "product_categories") idKey = "category_id";
          else if (fieldName === "product_sizes") idKey = "size_id";
          else if (fieldName === "product_colors") idKey = "color_id";
          else if (fieldName === "product_tags") idKey = "tag_id";
          else if (fieldName === "product_brands") idKey = "brand_id";

          if (idKey) {
            extractedIds = rawValueFromProduct
              .map((item: any) => {
                const nestedObjectName = fieldName.replace("product_", "");
                return item?.[idKey] ?? item?.[nestedObjectName]?.id;
              })
              .filter((id: number) => id !== null && id !== undefined);
          }
        }
        processedDefaults[fieldName] = extractedIds as PathValue<T, Path<T>>;
        initialCheckboxState[String(fieldName)] = new Set(extractedIds);
      } else if (field.type === "date") {
        if (rawValueFromProduct) {
          // Convert Date or ISO string to 'YYYY-MM-DD' for input
          processedDefaults[fieldName] = formatDateForInput(
            rawValueFromProduct,
          ) as PathValue<T, Path<T>>;
        } else {
          // If no value, set empty string
          processedDefaults[fieldName] = "" as PathValue<T, Path<T>>;
        }
      } else if (field.type !== "file" && rawValueFromProduct !== undefined) {
        processedDefaults[fieldName] = rawValueFromProduct as PathValue<
          T,
          Path<T>
        >;
      }
    });

    reset({ ...defaultValues, ...processedDefaults });
    setCheckboxGroupCheckedState(initialCheckboxState);
    setExistingImages(initialExistingImages);

    // For each field of type "file", initialize deletion tracking
    const initialImagesToDelete: Record<string, string[]> = {};
    fields.forEach((field) => {
      if (field.type === "file") {
        initialImagesToDelete[String(field.name)] = [];
      }
    });
    setImagesToDelete(initialImagesToDelete);
  }, [defaultValues, fields, reset]);

  // Update form with file and image information
  useEffect(() => {
    fields.forEach((field) => {
      if (field.type === "file") {
        const fieldName = String(field.name);
        const fieldFiles = uploadedFiles[fieldName] || [];
        const fieldExistingImages = existingImages[fieldName] || [];
        const fieldImagesToDelete = imagesToDelete[fieldName] || [];

        // Update field value in form with new file data
        setValue(
          field.name,
          {
            newFiles: fieldFiles,
            existingImages: fieldExistingImages,
            imagesToDelete: fieldImagesToDelete,
          } as any,
          {
            shouldValidate: true,
          },
        );
      }
    });
  }, [uploadedFiles, existingImages, imagesToDelete, fields, setValue]);

  const handleCheckboxGroupChange = useCallback(
    (name: Path<T>, optionValue: string | number, checked: boolean) => {
      const fieldName = String(name);
      setCheckboxGroupCheckedState((prev) => {
        const newSet = new Set(prev[fieldName] || []);
        if (checked) newSet.add(optionValue);
        else newSet.delete(optionValue);
        // Update value in react-hook-form
        setValue(name, Array.from(newSet) as PathValue<T, Path<T>>, {
          shouldValidate: true,
          shouldDirty: true,
        });
        return { ...prev, [fieldName]: newSet };
      });
    },
    [setValue],
  );

  const isCheckboxChecked = useCallback(
    (name: string, value: string | number): boolean => {
      return checkboxGroupCheckedState[name]?.has(value) || false;
    },
    [checkboxGroupCheckedState],
  );

  // Handle uploading new files
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, fieldName: Path<T>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      setUploadedFiles((prev) => {
        const prevFiles = prev[String(fieldName)] || [];
        const newFiles = [...prevFiles, ...fileArray];

        return {
          ...prev,
          [String(fieldName)]: newFiles,
        };
      });
    },
    [],
  );

  // Remove a new (not yet uploaded to server) file
  const handleRemoveFile = useCallback((fieldName: Path<T>, index: number) => {
    setUploadedFiles((prev) => {
      const fieldFiles = [...(prev[String(fieldName)] || [])];
      fieldFiles.splice(index, 1);

      return {
        ...prev,
        [String(fieldName)]: fieldFiles,
      };
    });
  }, []);

  // Remove an existing image - UPDATED to use cloudinary_public_id
  const handleRemoveExistingImage = useCallback(
    (fieldName: Path<T>, cloudinaryPublicId: string) => {
      // Add ID to the list of files to delete
      setImagesToDelete((prev) => {
        const toDelete = [...(prev[String(fieldName)] || [])];
        if (!toDelete.includes(cloudinaryPublicId)) {
          toDelete.push(cloudinaryPublicId);
        }
        return {
          ...prev,
          [String(fieldName)]: toDelete,
        };
      });

      // Remove from the list of existing images (for display)
      setExistingImages((prev) => {
        const images = [...(prev[String(fieldName)] || [])];
        const filteredImages = images.filter(
          (img) => img.cloudinary_public_id !== cloudinaryPublicId,
        );
        return {
          ...prev,
          [String(fieldName)]: filteredImages,
        };
      });
    },
    [],
  );

  // Modify onSubmit to work with form including files
  const handleFormSubmit = useCallback(
    (data: T) => {
      const processedData: any = { ...data };

      fields.forEach((field) => {
        if (field.type === "file") {
          const name = String(field.name);
          const wrapper = {
            newFiles: uploadedFiles[name] || [],
            existingImagesIds: (existingImages[name] || []).map(
              (img) => img.id,
            ),
            imagesToDelete: imagesToDelete[name] || [],
          };
          console.log(wrapper);

          if (field.multiple) {
            // залишаємо всю структуру для кількох файлів
            processedData[name] = wrapper;
          } else {
            // тільки один файл – беремо пріоритет: новий → вже існуючий → null
            if (wrapper.newFiles.length) {
              processedData[name] = wrapper.newFiles;
            } else if (wrapper.existingImagesIds.length) {
              processedData[name] = wrapper.existingImagesIds[0];
            } else {
              processedData[name] = null;
            }
          }
        }
      });

      onSubmit(processedData as T);
    },
    [fields, uploadedFiles, existingImages, imagesToDelete, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      {title && <h3 className="text-lg font-medium mb-3">{title}</h3>}

      {fields.map((field) => {
        const fieldName = field.name as string;
        return (
          <div key={fieldName} className="mb-4">
            {/* --- Checkbox --- */}
            {field.type === "checkbox" ? (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={fieldName}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  {...register(field.name, field.validation)}
                />
                <label
                  htmlFor={fieldName}
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
              </div>
            ) : /* --- Checkbox Group --- */
            field.type === "checkbox-group" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {field.options?.map((option) => {
                    const optionId = `${fieldName}-${option.value}`;
                    const isChecked = isCheckboxChecked(
                      fieldName,
                      option.value,
                    );
                    return (
                      <div key={optionId} className="flex items-center">
                        <input
                          type="checkbox"
                          id={optionId}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={isChecked}
                          onChange={(e) =>
                            handleCheckboxGroupChange(
                              field.name,
                              option.value,
                              e.target.checked,
                            )
                          }
                        />
                        <label
                          htmlFor={optionId}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {option.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <input
                  type="hidden"
                  {...register(field.name, field.validation)}
                />
              </div>
            ) : /* --- File Input --- */
            field.type === "file" ? (
              <>
                <label
                  htmlFor={fieldName}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}:
                </label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span>Вибрати {field.multiple ? "файли" : "файл"}</span>
                    <input
                      id={fieldName}
                      type="file"
                      className="sr-only"
                      multiple={field.multiple}
                      accept={field.accept || "image/*"}
                      onChange={(e) => handleFileChange(e, field.name)}
                    />
                  </label>
                  {(uploadedFiles[fieldName]?.length > 0 ||
                    existingImages[fieldName]?.length > 0) && (
                    <span className="ml-3 text-sm text-gray-600">
                      Вибрано файлів:
                      {(uploadedFiles[fieldName]?.length || 0) +
                        (existingImages[fieldName]?.length || 0)}
                    </span>
                  )}
                </div>

                {existingImages[fieldName]?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Існуючі зображення:
                    </p>
                    <ExistingImagePreview
                      images={existingImages[fieldName]}
                      onRemove={(cloudinaryPublicId) =>
                        handleRemoveExistingImage(
                          field.name,
                          cloudinaryPublicId,
                        )
                      }
                    />
                  </div>
                )}

                {uploadedFiles[fieldName]?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Нові зображення:
                    </p>
                    <FilePreview
                      files={uploadedFiles[fieldName]}
                      onRemove={(index) => handleRemoveFile(field.name, index)}
                    />
                  </div>
                )}

                <input
                  type="hidden"
                  {...register(field.name, field.validation)}
                />
              </>
            ) : /* --- Date Input --- */
            field.type === "date" ? (
              <>
                <label
                  htmlFor={fieldName}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}:
                </label>
                <input
                  id={fieldName}
                  type="date"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                  {...register(field.name, field.validation)}
                />
              </>
            ) : (
              <>
                <label
                  htmlFor={fieldName}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}:
                </label>
                {field.type === "select" ? (
                  <select
                    id={fieldName}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    {...register(field.name, field.validation)}
                  >
                    <option value="">Виберіть...</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  /* --- Standard inputs (Text, Number, etc.) --- */
                  <input
                    id={fieldName}
                    type={
                      field.type === "tel" ||
                      field.type === "url" ||
                      field.type === "email" ||
                      field.type === "password" ||
                      field.type === "number"
                        ? field.type
                        : "text"
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    {...register(field.name, field.validation)}
                  />
                )}
              </>
            )}

            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">
                {(errors[fieldName]?.message as string) || "Помилка валідації"}
              </p>
            )}

            {field.preview && watch(field.name) !== undefined && (
              <div className="mt-2 text-sm text-gray-600">
                {field.preview(watch(field.name))}
              </div>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Збереження..." : submitLabel}
      </button>
    </form>
  );
}
