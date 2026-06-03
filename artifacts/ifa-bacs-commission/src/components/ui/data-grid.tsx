import * as React from "react"
import { cn } from "@/lib/utils"
import { Link } from "wouter"

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export function DataGrid<T extends { id: string | number }>({ columns, data, className }: DataGridProps<T>) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key}
                className={cn(
                  "py-[24px] px-[5px] text-left align-middle font-['Livvic'] font-semibold text-[#002f5c] text-[18px]",
                  "border-y-[3px] border-[#04589b] bg-white",
                  i === 0 && "pl-4",
                  i === columns.length - 1 && "pr-4"
                )}
              >
                <div className="flex items-center gap-4">
                  {col.header}
                  {col.sortable && (
                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#005a9c]">
                      <path d="M6 0L12 6H0L6 0Z" fill="currentColor" opacity="0.3"/>
                      <path d="M6 16L0 10H12L6 16Z" fill="currentColor" opacity="0.3"/>
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={cn(
                "group cursor-default",
                rowIndex % 2 === 0 ? "bg-white" : "bg-[#e7ebec34]",
                "hover:bg-[#05579B] hover:text-white"
              )}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={col.key}
                  className={cn(
                    "p-[5px] align-middle font-['Mulish'] font-light text-[16px]",
                    colIndex === 0 && "pl-4 text-[#005a9c] underline group-hover:text-white",
                    !col.render && colIndex !== 0 && "text-[#3d3d3d] group-hover:text-white",
                    colIndex === columns.length - 1 && "pr-4"
                  )}
                >
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
