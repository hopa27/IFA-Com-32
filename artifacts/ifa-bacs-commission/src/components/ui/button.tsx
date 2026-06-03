import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[30px] font-sans text-base font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-[#979797] disabled:text-white disabled:opacity-100",
  {
    variants: {
      variant: {
        default:
          "bg-[#006cf4] text-white shadow-md hover:bg-[#003578]",
        destructive:
          "bg-[#d72714] text-white shadow-sm hover:bg-[#d72714]/90",
        outline:
          "border border-[#BBBBBB] bg-white shadow-sm hover:bg-[#eaf5f8] hover:text-[#3d3d3d]",
        secondary:
          "bg-white text-[#04589b] border border-[#04589b] font-bold shadow-md hover:bg-[#003578] hover:text-white hover:border-[#003578]",
        ghost: "hover:bg-white/10 hover:text-white",
        link: "text-[#005a9c] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[44px] px-8 py-2",
        sm: "h-8 rounded-[30px] px-3 text-xs",
        lg: "h-10 rounded-[30px] px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
