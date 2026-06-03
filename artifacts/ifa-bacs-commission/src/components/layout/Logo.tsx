import lveLogo from "@/assets/lve-logo.png"

interface LogoProps {
  className?: string
  variant?: "light" | "dark"
}

export function Logo({ className }: LogoProps) {
  return (
    <img
      src={lveLogo}
      alt="LV="
      className={className}
    />
  )
}
