import * as React from "react"
import { Link, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/layout/Logo"

export function Header() {
  const [location] = useLocation();
  const pageTitle = location === "/components" ? "Component Library" : "IFA Bacs Commission";

  return (
    <header className="w-full bg-[#00263e] py-5 px-[142px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Logo variant="light" className="h-6 w-auto cursor-pointer" />
          </Link>
          <div className="h-8 w-px bg-slate-600/50" />
          <h1 className="font-['Livvic'] text-3xl font-normal tracking-tight text-white">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="h-8 text-white hover:bg-white/10">
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
