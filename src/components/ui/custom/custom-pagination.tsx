import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import CustomDropdown from "./custom-dropdown";

type PaginationMeta = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
};

type CommonPaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  showPerPageSelector?: boolean;
  perPageOptions?: number[];
};

const CustomPagination: React.FC<CommonPaginationProps> = ({
  meta,
  onPageChange,
  onPerPageChange,
  showPerPageSelector = false,
  perPageOptions = [6, 12, 24, 48],
}) => {
  const { page, per_page, total, total_pages } = meta;

  const totalPages = total_pages ?? Math.ceil(total / per_page);

  const generatePages = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) pages.push("ellipsis");

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 2) pages.push("ellipsis");

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  if (total < 1) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 w-full">
      {/* LEFT — Data Info */}
      <div className="text-sm text-gray-500 w-full md:w-auto text-center md:text-left">
        {Math.min((page - 1) * per_page + 1, total)}–
        {Math.min(page * per_page, total)} of {total}
      </div>

      {/* CENTER — Pagination */}
      <div className="flex justify-center w-full md:w-auto">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {pages.map((p, index) => (
              <PaginationItem key={index}>
                {p === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === p}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(p);
                    }}
                    className={page === p ? "bg-primary text-white" : ""}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) onPageChange(page + 1);
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* RIGHT — Per Page Selector */}
      <div className="w-full md:w-auto flex justify-center md:justify-end">
        {showPerPageSelector && onPerPageChange && (
          <div className="flex items-center gap-2 text-sm">
            <span>Rows per page:</span>

            <CustomDropdown
              name="rowsPerPage"
              value={String(per_page)}
              onChange={(e) => onPerPageChange(Number(e))}
              options={perPageOptions.map((option) => ({
                label: option.toString(),
                value: String(option),
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPagination;
