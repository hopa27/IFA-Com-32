import { MdErrorOutline } from "react-icons/md";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-[125vh] flex flex-col bg-[#f0f0f0]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-[12px] border border-[#BBBBBB] shadow-sm p-12 max-w-md w-full flex flex-col items-center text-center">
          <MdErrorOutline className="text-[64px] text-[#d72714] mb-4" />
          <h1 className="font-['Livvic'] text-[24px] font-semibold text-[#002f5c] mb-2">
            404 — Page Not Found
          </h1>
          <p className="font-['Mulish'] text-[16px] text-[#3d3d3d]">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
