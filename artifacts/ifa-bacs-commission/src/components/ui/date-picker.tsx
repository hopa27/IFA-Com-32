import * as React from "react"
import { format } from "date-fns"
import { MdOutlineCalendarToday } from "react-icons/md"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  highlightMondays?: boolean;
}

export function DatePicker({ date, onSelect, placeholder = "Select date", error, disabled, highlightMondays }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "relative flex items-center h-[44px] w-full rounded-[8px] border border-[#BBBBBB] bg-white text-left font-['Mulish'] text-[16px] leading-[26px] text-[#3d3d3d] transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-[#CCCCCC] disabled:border-[#ACACAC] disabled:border-[2px] disabled:opacity-100",
            !date && "text-[#BBBBBB]",
            error && "border-[#d72714] text-[#d72714]",
            isOpen && !error && "border-[#178830] border-[2px]",
            !isOpen && !error && !disabled && "hover:border-[#178830]",
            // Adjust padding to avoid layout shift when border becomes 2px
            isOpen && !error ? "px-[11px] py-[7px]" : "px-[12px] py-[8px]"
          )}
        >
          <span className="flex-1 truncate">
            {date ? format(date, "dd, MMM, yyyy") : placeholder}
          </span>
          <div className="absolute right-0 flex items-center h-full pr-[12px] pointer-events-none">
            <div className="h-6 w-[1px] bg-[#BBBBBB] mr-[8px]" />
            <MdOutlineCalendarToday className={cn(
              "text-[20px] text-[#006cf4]",
              error && "text-[#d72714]",
              disabled && "text-[#979797]"
            )} />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-auto p-0 rounded-[12px] border-[2px] border-[#178830] overflow-hidden bg-white",
          error && "border-[#d72714]"
        )} 
        align="start"
      >
        <Calendar
          selected={date}
          error={error}
          highlightMondays={highlightMondays}
          onSelect={(d) => {
            onSelect?.(d);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
