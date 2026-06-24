import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { MdOutlineCalendarToday } from "react-icons/md"
import { cn } from "@/lib/utils"
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
  isDateDisabled?: (date: Date) => boolean;
}

const DATE_FORMAT = "dd/MM/yyyy";

export function DatePicker({ date, onSelect, placeholder = "DD/MM/YYYY", error, disabled, highlightMondays, isDateDisabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(date ? format(date, DATE_FORMAT) : "");
  const [typedInvalid, setTypedInvalid] = React.useState(false);

  // Keep the text in sync when the date is changed externally (calendar, parent).
  React.useEffect(() => {
    setInputValue(date ? format(date, DATE_FORMAT) : "");
    setTypedInvalid(false);
  }, [date]);

  const commitTypedValue = () => {
    const trimmed = inputValue.trim();
    if (trimmed === "") {
      setTypedInvalid(false);
      onSelect?.(undefined);
      return;
    }
    const parsed = parse(trimmed, DATE_FORMAT, new Date());
    if (isValid(parsed) && format(parsed, DATE_FORMAT) === trimmed && !(isDateDisabled?.(parsed))) {
      setTypedInvalid(false);
      onSelect?.(parsed);
    } else {
      setTypedInvalid(true);
    }
  };

  const showError = error || typedInvalid;
  const active = isOpen || isFocused;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn(
          "relative flex items-center h-[44px] w-full rounded-[8px] border bg-white font-['Mulish'] text-[16px] leading-[26px] text-[#3d3d3d] transition-colors",
          "border-[#BBBBBB]",
          showError && "border-[#d72714] border-[2px]",
          !showError && active && "border-[#178830] border-[2px]",
          !showError && !active && !disabled && "hover:border-[#178830]",
          disabled && "cursor-not-allowed bg-[#CCCCCC] border-[#ACACAC] border-[2px]",
          // Adjust padding to avoid layout shift when border becomes 2px
          (active || showError) ? "pl-[11px] py-[7px]" : "pl-[12px] py-[8px]"
        )}
      >
        <input
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={inputValue}
          placeholder={placeholder}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (typedInvalid) setTypedInvalid(false);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            commitTypedValue();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitTypedValue();
              (e.target as HTMLInputElement).blur();
            }
          }}
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none placeholder:text-[#BBBBBB] disabled:cursor-not-allowed",
            showError && "text-[#d72714]"
          )}
        />
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label="Open calendar"
            className="flex items-center h-full pr-[12px] pl-[8px] focus:outline-none disabled:cursor-not-allowed"
          >
            <div className="h-6 w-[1px] bg-[#BBBBBB] mr-[8px]" />
            <MdOutlineCalendarToday className={cn(
              "text-[20px] text-[#006cf4]",
              showError && "text-[#d72714]",
              disabled && "text-[#979797]"
            )} />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        className={cn(
          "w-auto p-0 rounded-[12px] border-[2px] border-[#178830] overflow-hidden bg-white",
          showError && "border-[#d72714]"
        )}
        align="start"
      >
        <Calendar
          selected={date}
          error={showError}
          highlightMondays={highlightMondays}
          isDateDisabled={isDateDisabled}
          onSelect={(d) => {
            onSelect?.(d);
            setIsOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
