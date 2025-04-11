import React, { ReactNode } from "react";

interface TableColumn<T> {
  header: string;
  key: string;
  render?: (item: T) => ReactNode;
  width?: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField: keyof T;
  expandedRows?: Array<string | number>;
  onRowToggle?: (id: string | number) => void;
  renderExpandedContent?: (item: T) => ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function GenericTable<T>({
  data,
  columns,
  keyField,
  expandedRows = [],
  onRowToggle,
  renderExpandedContent,
  isLoading = false,
  emptyMessage = "Немає даних",
}: GenericTableProps<T>) {
  if (isLoading) return <p className="p-4">Завантаження...</p>;
  if (!data?.length) return <div className="p-4">{emptyMessage}</div>;

  // Функція для обробки кліку на рядок
  const handleRowClick = (rowId: string | number) => {
    if (onRowToggle) {
      onRowToggle(rowId);
    }
  };

  return (
    <div className="overflow-hidden border border-gray-200 rounded-lg mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => {
            const rowId = String(item[keyField]);
            const isExpanded = expandedRows.includes(rowId);

            return (
              <React.Fragment key={rowId}>
                <tr
                  className={`cursor-pointer ${isExpanded ? "bg-blue-50" : ""}`}
                  onClick={() => onRowToggle && handleRowClick(rowId)}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowId}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] || "")}
                    </td>
                  ))}
                </tr>
                {isExpanded && renderExpandedContent && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200"
                    >
                      {renderExpandedContent(item)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
