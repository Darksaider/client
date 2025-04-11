// import { Controller, FieldValues } from "react-hook-form";

// // Типи полів форми
// export type FieldType = "input" | "select" | "textarea" | "checkbox" | "date";

// // Опис поля форми
// export interface FieldConfig<T extends FieldValues> {
//   name: keyof T;
//   label: string;
//   type: FieldType;
//   rules?: {
//     required?: string;
//     minLength?: { value: number; message: string };
//     pattern?: { value: RegExp; message: string };
//     [key: string]: any;
//   };
//   options?: Array<{ value: string; label: string }>;
//   placeholder?: string;
// }

// // Універсальне поле форми
// interface FormFieldProps<T extends FieldValues> {
//   field: FieldConfig<T>;
//   control: any;
//   errors: any;
// }

// export function FormField<T extends FieldValues>({
//   field,
//   control,
//   errors,
// }: FormFieldProps<T>) {
//   const { name, label, type, rules, options = [], placeholder } = field;

//   const renderField = (fieldProps: any) => {
//     switch (type) {
//       case "select":
//         return (
//           <select
//             {...fieldProps}
//             className="w-full px-3 py-2 border rounded-md"
//           >
//             <option value="">
//               {placeholder || `Виберіть ${label.toLowerCase()}`}
//             </option>
//             {options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         );
//       case "textarea":
//         return (
//           <textarea
//             {...fieldProps}
//             className="w-full px-3 py-2 border rounded-md"
//             placeholder={placeholder}
//           />
//         );
//       case "checkbox":
//         return (
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               {...fieldProps}
//               id={`field-${String(name)}`}
//               className="mr-2"
//             />
//             <label htmlFor={`field-${String(name)}`}>{label}</label>
//           </div>
//         );
//       case "date":
//         return (
//           <input
//             type="date"
//             {...fieldProps}
//             className="w-full px-3 py-2 border rounded-md"
//           />
//         );
//       default:
//         return (
//           <input
//             {...fieldProps}
//             className="w-full px-3 py-2 border rounded-md"
//             placeholder={placeholder}
//           />
//         );
//     }
//   };

//   return (
//     <div className="mb-3">
//       {type !== "checkbox" && (
//         <label className="block text-sm font-medium mb-1">{label}</label>
//       )}
//       <Controller
//         name={String(name) as any}
//         control={control}
//         rules={rules}
//         render={({ field: fieldProps }) => renderField(fieldProps)}
//       />
//       {errors[name as any] && (
//         <p className="text-red-500 text-sm mt-1">
//           {errors[name as any]?.message as string}
//         </p>
//       )}
//     </div>
//   );
// }
