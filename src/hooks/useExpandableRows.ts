import { useState } from "react";

export function useExpandableRows<T>(
  initialExpanded: Array<string | number> = [],
) {
  const [expandedRows, setExpandedRows] =
    useState<Array<string | number>>(initialExpanded);

  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const isRowExpanded = (id: string | number) => {
    return expandedRows.includes(id);
  };

  const expandRow = (id: string | number) => {
    if (!isRowExpanded(id)) {
      setExpandedRows((prev) => [...prev, id]);
    }
  };

  const collapseRow = (id: string | number) => {
    setExpandedRows((prev) => prev.filter((rowId) => rowId !== id));
  };

  const collapseAll = () => {
    setExpandedRows([]);
  };

  const expandAll = (ids: Array<string | number>) => {
    setExpandedRows(ids);
  };

  return {
    expandedRows,
    toggleRow,
    isRowExpanded,
    expandRow,
    collapseRow,
    collapseAll,
    expandAll,
  };
}
