import * as React from "react"
import { MdOutlineCalendarToday } from "react-icons/md"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  suffixIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, suffixIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <input
          type={type}
          disabled={disabled}
          className={cn(
            "flex h-[44px] w-full rounded-[8px] border border-[#BBBBBB] bg-white px-[12px] py-[8px] font-['Mulish'] text-[16px] leading-[26px] text-[#3d3d3d] transition-colors placeholder:text-[#BBBBBB] placeholder:font-['Mulish'] focus:border-[#178830] focus:border-[3px] focus:px-[10px] focus:py-[6px] hover:border-[#178830] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[#CCCCCC] disabled:border-[#ACACAC] disabled:border-[2px] disabled:opacity-100",
            error && "border-[#d72714] text-[#d72714] placeholder:text-[#d72714] focus:border-[#d72714] hover:border-[#d72714]",
            suffixIcon && "pr-[40px]", // Make room for icon
            className
          )}
          ref={ref}
          {...props}
        />
        {suffixIcon && (
          <div className="absolute right-0 flex items-center h-full pr-[12px] pointer-events-none">
            <div className="h-6 w-[1px] bg-[#BBBBBB] mr-[8px]" />
            <div className={cn(
              "text-[#006cf4] text-[20px]",
              error && "text-[#d72714]",
              disabled && "text-[#979797]"
            )}>
              {suffixIcon}
            </div>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
