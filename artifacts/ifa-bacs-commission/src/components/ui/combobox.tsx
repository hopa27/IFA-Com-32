import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MdKeyboardArrowDown, MdCheck } from "react-icons/md"
import { cn } from "@/lib/utils"

export interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: boolean;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  error,
  disabled
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "relative flex items-center justify-between w-full h-[44px] rounded-[8px] border border-[#BBBBBB] bg-white px-[12px] font-['Mulish'] text-[16px] text-[#3d3d3d] transition-colors focus:outline-none disabled:cursor-not-allowed disabled:bg-[#CCCCCC] disabled:border-[#ACACAC] disabled:opacity-100",
            !value && "text-[#BBBBBB]",
            error && "border-[#d72714] text-[#d72714]",
            !disabled && !error && !open && "hover:border-[#178830]",
            open && !error && "border-[3px] border-[#178830] !border-b-0 rounded-b-none px-[10px]",
            open && error && "border-[3px] border-[#d72714] !border-b-0 rounded-b-none px-[10px]"
          )}
        >
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <div className="absolute right-0 flex items-center h-full pr-[12px] pointer-events-none">
            <div className="h-6 w-[1px] bg-[#BBBBBB] mr-[8px]" />
            <MdKeyboardArrowDown className={cn(
              "text-[24px] text-[#006cf4] transition-transform duration-200",
              open && "rotate-180",
              error && "text-[#d72714]",
              disabled && "text-[#979797]"
            )} />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-0 border-[3px] border-[#178830] !border-t-0 rounded-t-none bg-white overflow-hidden",
          error && "border-[#d72714]"
        )}
        sideOffset={0}
        avoidCollisions={false}
        align="start"
      >
        <Command className="w-full">
          <CommandInput 
            placeholder={searchPlaceholder} 
            className="font-['Mulish'] border-b border-slate-100" 
          />
          <CommandList className="max-h-[200px] overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm font-['Mulish'] text-[#BBBBBB]">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange?.(option.value === value ? "" : option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    "font-['Mulish'] text-[16px] text-[#3d3d3d] py-3 px-4 rounded-none cursor-pointer data-[selected=true]:bg-[#05579B] data-[selected=true]:text-white"
                  )}
                >
                  <MdCheck
                    className={cn(
                      "mr-2 h-5 w-5",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
