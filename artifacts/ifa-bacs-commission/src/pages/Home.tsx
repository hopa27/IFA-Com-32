import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MdUndo, MdPlayArrow } from "react-icons/md";
import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns";

const RECORD_COUNT = 5;

export default function Home() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [payDate, setPayDate] = useState<Date | undefined>();
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const resetFields = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setPayDate(undefined);
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date) {
      const suggestedEnd = addDays(date, 6);
      setEndDate(suggestedEnd);
      setPayDate(addDays(suggestedEnd, 3));
    } else {
      setEndDate(undefined);
      setPayDate(undefined);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    setPayDate(date ? addDays(date, 3) : undefined);
  };

  const handleUndo = () => {
    resetFields();
    toast({
      title: "Cleared",
      description: "Date fields have been reset.",
    });
  };

  const allFieldsFilled = Boolean(startDate && endDate && payDate);

  const handleCalc = () => {
    setIsCalculating(true);
    const effectivePayDate = payDate ?? endDate ?? new Date();
    setTimeout(() => {
      setIsCalculating(false);
      resetFields();
      toast({
        title: "Report sent to Finance team",
        description: `${RECORD_COUNT} records for pay date ${format(effectivePayDate, "dd MMM yyyy")} were calculated and the BACS file was sent automatically.`,
      });
    }, 600);
  };

  return (
    <div className="min-h-[125vh] flex flex-col bg-[#f0f0f0]">
      <Header />
      
      <main className="flex-1 px-[142px] py-8 flex flex-col gap-8">
        
        {/* Filter Form Card */}
        <div className="bg-white rounded-[12px] border border-[#BBBBBB] p-8 shadow-sm">
          <h2 className="font-['Livvic'] text-[24px] font-semibold text-[#002f5c] mb-6">Calculate Commission Run</h2>
          
          <div className="flex items-end gap-6">
            <div className="w-[280px]">
              <label className="block font-['Livvic'] text-[14px] font-medium text-[#3d3d3d] mb-2">Start Date</label>
              <DatePicker date={startDate} onSelect={handleStartDateSelect} />
            </div>
            
            <div className="w-[280px]">
              <label className="block font-['Livvic'] text-[14px] font-medium text-[#3d3d3d] mb-2">End Date</label>
              <DatePicker
                date={endDate}
                onSelect={handleEndDateSelect}
                isDateDisabled={startDate ? (d) => isBefore(startOfDay(d), startOfDay(startDate)) : undefined}
              />
            </div>

            <div className="w-[280px]">
              <label className="block font-['Livvic'] text-[14px] font-medium text-[#3d3d3d] mb-2">Pay Date</label>
              <DatePicker
                date={payDate}
                onSelect={setPayDate}
                placeholder="Select pay date"
                isDateDisabled={endDate ? (d) => !isAfter(startOfDay(d), startOfDay(endDate)) : undefined}
              />
            </div>

            <div className="flex gap-4 ml-auto">
              <Button variant="secondary" onClick={handleUndo} disabled={isCalculating || !allFieldsFilled} className="gap-2">
                <MdUndo className="text-[20px]" />
                Undo
              </Button>
              <Button onClick={handleCalc} disabled={isCalculating || !allFieldsFilled} className="gap-2">
                <MdPlayArrow className="text-[20px]" />
                {isCalculating ? "Calculating..." : "GO!!"}
              </Button>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
