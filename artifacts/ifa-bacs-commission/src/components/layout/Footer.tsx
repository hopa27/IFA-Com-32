import { Logo } from "@/components/layout/Logo"

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto shrink-0 py-4 px-8 flex flex-row justify-between items-center">
      <Logo variant="dark" className="h-6 w-auto" />
      <div className="text-[10px] font-medium text-slate-400 text-right">
        LVE Financial Services Ltd<br />
        123 Corporate Square, London, UK
      </div>
    </footer>
  )
}
