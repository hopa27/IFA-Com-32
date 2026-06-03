import * as React from "react"
import { cn } from "@/lib/utils"

export interface EditableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  editableType?: "radio" | "checkbox" | "percentage" | "text";
  onEdit?: (rowId: string | number, value: any) => void;
}

export interface EditableDataGridProps<T> {
  columns: EditableColumn<T>[];
  data: T[];
  className?: string;
}

export function EditableDataGrid<T extends { id: string | number }>({ columns, data, className }: EditableDataGridProps<T>) {
  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table className="w-full border-separate border-spacing-0">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key}
                className={cn(
                  "py-[16px] px-[8px] text-left align-middle font-['Livvic'] font-semibold text-[#002f5c] text-[16px]",
                  "border-b-[2px] border-[#002f5c] bg-white",
                  i === 0 && "pl-4",
                  i === columns.length - 1 && "pr-4"
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id}
              className={cn(
                rowIndex % 2 === 0 ? "bg-white" : "bg-[#f4f7f8]"
              )}
            >
              {columns.map((col, colIndex) => {
                let cellContent: React.ReactNode;

                if (col.render) {
                  cellContent = col.render(row);
                } else if (col.editableType === "radio") {
                  const val = (row as any)[col.key];
                  cellContent = (
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border border-[#979797] flex items-center justify-center cursor-pointer",
                        val && "border-[#006cf4]"
                      )}
                      onClick={() => col.onEdit?.(row.id, !val)}
                    >
                      {val && <div className="w-2 h-2 rounded-full bg-[#006cf4]" />}
                    </div>
                  );
                } else if (col.editableType === "checkbox") {
                  const val = (row as any)[col.key];
                  cellContent = (
                    <div
                      className={cn(
                        "w-4 h-4 border border-[#979797] rounded flex items-center justify-center cursor-pointer",
                        val && "bg-[#178830] border-[#178830]"
                      )}
                      onClick={() => col.onEdit?.(row.id, !val)}
                    >
                      {val && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  );
                } else if (col.editableType === "percentage") {
                  const val = (row as any)[col.key];
                  cellContent = (
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => col.onEdit?.(row.id, e.target.value)}
                        className="h-[36px] w-[100px] text-center font-['Mulish'] text-[#3d3d3d] border border-[#BBBBBB] rounded-[4px] focus:outline-none focus:border-[3px] focus:border-[#178830] focus:text-[#178830]"
                      />
                      <span className="ml-2 font-['Mulish']">%</span>
                    </div>
                  );
                } else {
                  cellContent = (row as any)[col.key];
                }

                return (
                  <td
                    key={col.key}
                    className={cn(
                      "p-[8px] align-middle font-['Mulish'] font-light text-[#3d3d3d] text-[16px]",
                      colIndex === 0 && "pl-4",
                      colIndex === columns.length - 1 && "pr-4"
                    )}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
