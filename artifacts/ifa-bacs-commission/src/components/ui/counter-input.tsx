import * as React from "react"
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md"
import { cn } from "@/lib/utils"

export interface CounterInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  error?: boolean;
}

export const CounterInput = React.forwardRef<HTMLInputElement, CounterInputProps>(
  ({ className, value = 0, onChange, error, disabled, ...props }, ref) => {
    const handleIncrement = () => {
      if (!disabled && onChange) onChange(value + 1);
    };

    const handleDecrement = () => {
      if (!disabled && onChange && value > 0) onChange(value - 1);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val) && val >= 0) {
        if (onChange) onChange(val);
      } else if (e.target.value === '') {
        if (onChange) onChange(0);
      }
    };

    return (
      <div className={cn(
        "relative flex items-center h-[44px] w-full rounded-[8px] border border-[#BBBBBB] bg-white transition-colors overflow-hidden",
        error && "border-[#d72714]",
        !disabled && !error && "hover:border-[#178830] focus-within:border-[#178830] focus-within:border-[3px]",
        disabled && "bg-[#CCCCCC] border-[#ACACAC] border-[2px] opacity-100",
        className
      )}>
        <div className={cn(
          "pl-[12px] font-['Mulish'] text-[16px] text-[#3d3d3d]",
          error && "text-[#d72714]",
          disabled && "text-[#3d3d3d]"
        )}>£</div>
        <input
          ref={ref}
          type="text"
          value={value === 0 ? '' : value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent px-[8px] py-[8px] font-['Mulish'] text-[16px] leading-[26px] text-[#3d3d3d] focus:outline-none disabled:cursor-not-allowed",
            error && "text-[#d72714] placeholder:text-[#d72714]"
          )}
          {...props}
        />
        <div className="flex h-full items-center">
          <div className="h-6 w-[1px] bg-[#BBBBBB]" />
          <div className="flex flex-col h-full w-[32px] justify-center items-center">
            <button
              type="button"
              disabled={disabled}
              onClick={handleIncrement}
              className={cn(
                "flex items-center justify-center h-1/2 w-full text-[#006cf4] hover:text-[#003578] disabled:text-[#979797] disabled:cursor-not-allowed",
                error && "text-[#d72714]"
              )}
            >
              <MdKeyboardArrowUp className="w-5 h-5" />
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={handleDecrement}
              className={cn(
                "flex items-center justify-center h-1/2 w-full text-[#006cf4] hover:text-[#003578] disabled:text-[#979797] disabled:cursor-not-allowed",
                error && "text-[#d72714]"
              )}
            >
              <MdKeyboardArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);
CounterInput.displayName = "CounterInput";
