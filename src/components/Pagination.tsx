import React, { useMemo } from "react";
// Використовуй правильний імпорт для useSearchParams залежно від версії react-router
import { useSearchParams, URLSearchParamsInit } from "react-router";

const ITEMS_PER_PAGE: number = 10;
const SIBLING_COUNT: number = 1;
const ELLIPSIS: string = "...";
// -----------------------------

const range = (start: number, end: number): number[] => {
  if (start > end) return [];
  const length: number = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};
type PaginationButtonsProps = {
  productNumber: number;
  isLoading?: boolean;
};
export const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  productNumber,
  isLoading,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ВИКОРИСТОВУЙ ПРАВИЛЬНУ НАЗВУ ПОЛЯ!
  const totalItems: number = productNumber;

  const currentPage: number = parseInt(searchParams.get("page") || "1", 10);

  const totalPages: number = useMemo(() => {
    if (!totalItems) return 1;
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  }, [totalItems]);

  const paginationRange: (number | string)[] = useMemo(() => {
    const totalPageNumbersToShow: number = SIBLING_COUNT + 5;

    if (totalPages <= totalPageNumbersToShow) {
      return range(1, totalPages);
    }

    const leftSiblingIndex: number = Math.max(currentPage - SIBLING_COUNT, 1);
    const rightSiblingIndex: number = Math.min(
      currentPage + SIBLING_COUNT,
      totalPages,
    );

    const shouldShowLeftEllipsis: boolean = leftSiblingIndex > 2;
    const shouldShowRightEllipsis: boolean = rightSiblingIndex < totalPages - 1;

    const firstPageIndex: number = 1;
    const lastPageIndex: number = totalPages;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount: number = 3 + 2 * SIBLING_COUNT;
      const leftRange: number[] = range(1, leftItemCount);
      return [...leftRange, ELLIPSIS, lastPageIndex];
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount: number = 3 + 2 * SIBLING_COUNT;
      const rightRange: number[] = range(
        totalPages - rightItemCount + 1,
        totalPages,
      );
      return [firstPageIndex, ELLIPSIS, ...rightRange];
    }

    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const middleRange: number[] = range(leftSiblingIndex, rightSiblingIndex);
      return [
        firstPageIndex,
        ELLIPSIS,
        ...middleRange,
        ELLIPSIS,
        lastPageIndex,
      ];
    }

    return range(1, totalPages);
  }, [totalPages, currentPage]); // SIBLING_COUNT є константою

  // Функція для зміни сторінки - ТИП ПАРАМЕТРА ВИПРАВЛЕНО
  const handlePageChange = (newPage: string | number): void => {
    // Не реагуємо на клік по еліпсису або якщо тип не число
    if (typeof newPage !== "number") return;

    const validPage: number = Math.max(1, Math.min(newPage, totalPages));
    if (validPage !== currentPage) {
      const newSearchParams: URLSearchParamsInit = new URLSearchParams(
        searchParams,
      );
      newSearchParams.set("page", validPage.toString());
      setSearchParams(newSearchParams);
    }
  };

  if (isLoading || totalPages <= 1) {
    return <div className="h-10 my-4" aria-hidden="true"></div>;
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center space-x-1 my-4"
    >
      {paginationRange.map((pageNumber, index) => {
        const key: string =
          typeof pageNumber === "number"
            ? `page-${pageNumber}`
            : `ellipsis-${index}`;

        if (pageNumber === ELLIPSIS) {
          return (
            <span
              key={key}
              className="px-2 py-2 text-gray-500"
              aria-hidden="true"
            >
              … {/* HTML entity for ellipsis */}
            </span>
          );
        }

        const isActive: boolean = pageNumber === currentPage;
        return (
          <button
            key={key}
            // Передаємо pageNumber, який може бути string | number
            onClick={() => handlePageChange(pageNumber)}
            disabled={isLoading}
            className={`
                            px-3 py-1 min-w-[36px] text-sm rounded border border-gray-300 transition-colors duration-150 ease-in-out
                            ${
                              isActive
                                ? "bg-blue-500 text-white border-blue-500 z-10 cursor-default"
                                : "bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                            }
                            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
            aria-current={isActive ? "page" : undefined}
            aria-label={
              isActive
                ? `Поточна сторінка, ${pageNumber}`
                : `Перейти на сторінку ${pageNumber}`
            }
          >
            {pageNumber}
          </button>
        );
      })}
    </nav>
  );
};
