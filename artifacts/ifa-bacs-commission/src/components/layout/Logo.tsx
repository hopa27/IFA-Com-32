import * as React from "react"

interface LogoProps {
  className?: string
  variant?: "light" | "dark"
}

export function Logo({ className, variant = "light" }: LogoProps) {
  const wordmark = variant === "light" ? "#ffffff" : "#00263e"
  const accent = "#006cf4"

  return (
    <svg
      viewBox="0 0 132 32"
      role="img"
      aria-label="LVE"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="25"
        fontFamily="Livvic, sans-serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="1"
        fill={wordmark}
      >
        LV
      </text>
      <text
        x="56"
        y="25"
        fontFamily="Livvic, sans-serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="1"
        fill={accent}
      >
        E
      </text>
      <path
        d="M82 22 L92 12 L100 18 L116 6"
        stroke={accent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="116" cy="6" r="3.5" fill={accent} />
    </svg>
  )
}
