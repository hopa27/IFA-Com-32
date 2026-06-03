import * as React from "react"
import {
  addMonths,
  addYears,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  addDays,
  setMonth,
  setYear,
} from "date-fns"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import { cn } from "@/lib/utils"

const HATCH =
  "repeating-linear-gradient(45deg, transparent, transparent 5px, #e7ebec 5px, #e7ebec 10px)"

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

type View = "days" | "months" | "years"

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  error?: boolean
}

function NavButton({
  onClick,
  children,
  error,
}: {
  onClick: () => void
  children: React.ReactNode
  error?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md text-[#005a9c] transition-colors hover:text-[#003578] hover:bg-black/5",
        error && "text-[#d72714]"
      )}
    >
      {children}
    </button>
  )
}

export function Calendar({ selected, onSelect, error }: CalendarProps) {
  const [view, setView] = React.useState<View>("days")
  const [displayMonth, setDisplayMonth] = React.useState<Date>(
    startOfMonth(selected ?? new Date())
  )

  const captionColor = error ? "text-[#d72714]" : "text-[#005a9c]"

  // Build the 6-week day grid
  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(displayMonth), { weekStartsOn: 0 })
    return Array.from({ length: 42 }, (_, i) => addDays(start, i))
  }, [displayMonth])

  // Year picker range: 25 years aligned so the display year sits in the grid
  const yearRangeStart = React.useMemo(() => {
    const y = displayMonth.getFullYear()
    return y - (y % 25)
  }, [displayMonth])

  return (
    <div className="w-[300px] bg-white p-3 font-['Mulish']">
      {/* Header / caption */}
      <div className="mb-2 flex items-center justify-between px-1">
        <NavButton
          error={error}
          onClick={() => {
            if (view === "days") setDisplayMonth((m) => addMonths(m, -1))
            else if (view === "months") setDisplayMonth((m) => addYears(m, -1))
            else setDisplayMonth((m) => addYears(m, -25))
          }}
        >
          <MdKeyboardArrowLeft className="text-[22px]" />
        </NavButton>

        <div className="flex items-center gap-2">
          {view === "days" && (
            <button
              type="button"
              onClick={() => setView("months")}
              className={cn(
                "rounded px-1 text-[16px] font-bold hover:underline",
                captionColor
              )}
            >
              {MONTHS[displayMonth.getMonth()]}
            </button>
          )}
          <button
            type="button"
            onClick={() => setView(view === "years" ? "days" : "years")}
            className={cn(
              "rounded px-1 text-[16px] font-bold hover:underline",
              captionColor
            )}
          >
            {view === "years"
              ? `${yearRangeStart} - ${yearRangeStart + 24}`
              : displayMonth.getFullYear()}
          </button>
        </div>

        <NavButton
          error={error}
          onClick={() => {
            if (view === "days") setDisplayMonth((m) => addMonths(m, 1))
            else if (view === "months") setDisplayMonth((m) => addYears(m, 1))
            else setDisplayMonth((m) => addYears(m, 25))
          }}
        >
          <MdKeyboardArrowRight className="text-[22px]" />
        </NavButton>
      </div>

      {/* Days view */}
      {view === "days" && (
        <>
          <div
            className={cn(
              "mb-1 grid grid-cols-7 rounded-md bg-[#eef4f8] py-1",
              error ? "text-[#d72714]" : "text-[#002f5c]"
            )}
          >
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="text-center text-[12px] font-semibold"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day) => {
              const isOutside = !isSameMonth(day, displayMonth)
              const isSelected = selected && isSameDay(day, selected)
              const today = isToday(day)
              return (
                <div key={day.toISOString()} className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onSelect?.(day)}
                    style={isOutside ? { background: HATCH } : undefined}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-[14px] transition-colors",
                      "hover:bg-[#003578] hover:text-white",
                      isOutside && "opacity-50",
                      !isSelected && !today && "text-[#3d3d3d]",
                      today && !isSelected && "font-semibold text-[#006cf4]",
                      isSelected && "bg-[#006cf4] font-semibold text-white hover:bg-[#003578]"
                    )}
                  >
                    {day.getDate()}
                  </button>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Months view */}
      {view === "months" && (
        <div className="grid grid-cols-3 gap-2 pt-1">
          {MONTHS.map((m, i) => {
            const isSelected =
              selected &&
              selected.getMonth() === i &&
              selected.getFullYear() === displayMonth.getFullYear()
            return (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setDisplayMonth((d) => setMonth(d, i))
                  setView("days")
                }}
                className={cn(
                  "flex flex-col items-center justify-center rounded-md py-3 text-[14px] transition-colors",
                  "hover:bg-[#006cf4] hover:text-white",
                  isSelected
                    ? "bg-[#006cf4] text-white"
                    : "text-[#3d3d3d]"
                )}
              >
                <span className="text-[10px] opacity-60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold">{m.slice(0, 3)}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Years view */}
      {view === "years" && (
        <div className="grid grid-cols-5 gap-2 pt-1">
          {Array.from({ length: 25 }, (_, i) => yearRangeStart + i).map((year) => {
            const isSelected = selected && selected.getFullYear() === year
            return (
              <button
                key={year}
                type="button"
                onClick={() => {
                  setDisplayMonth((d) => setYear(d, year))
                  setView("months")
                }}
                style={!isSelected ? { background: HATCH } : undefined}
                className={cn(
                  "flex items-center justify-center rounded-md py-3 text-[13px] transition-colors",
                  "hover:bg-[#006cf4] hover:text-white",
                  isSelected
                    ? "bg-[#006cf4] font-semibold text-white"
                    : "text-[#3d3d3d]"
                )}
              >
                {year}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
