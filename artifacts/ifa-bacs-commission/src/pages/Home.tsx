import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { DataGrid } from "@/components/ui/data-grid";
import { MdUndo, MdPlayArrow } from "react-icons/md";
import { format, parseISO, addDays, isBefore, isAfter, startOfDay } from "date-fns";

interface CommissionRow {
  id: string;
  adviserName: string;
  agency: string;
  bacsReference: string;
  payDate: string;
  grossAmount: string;
  commissionPercent: string;
  commissionAmount: string;
  status: "Pending" | "Paid" | "Held";
}

const SAMPLE_DATA: CommissionRow[] = [
  { id: "1", adviserName: "John Smith", agency: "Alpha Financial", bacsReference: "BACS-001294", payDate: "2026-04-20", grossAmount: "£1,200.00", commissionPercent: "15%", commissionAmount: "£180.00", status: "Pending" },
  { id: "2", adviserName: "Sarah Jones", agency: "Beta Wealth", bacsReference: "BACS-001295", payDate: "2026-04-20", grossAmount: "£3,450.00", commissionPercent: "10%", commissionAmount: "£345.00", status: "Paid" },
  { id: "3", adviserName: "Michael Brown", agency: "Gamma Advisors", bacsReference: "BACS-001296", payDate: "2026-04-20", grossAmount: "£800.00", commissionPercent: "20%", commissionAmount: "£160.00", status: "Pending" },
  { id: "4", adviserName: "Emma Wilson", agency: "Delta Planning", bacsReference: "BACS-001297", payDate: "2026-04-20", grossAmount: "£5,600.00", commissionPercent: "12%", commissionAmount: "£672.00", status: "Held" },
  { id: "5", adviserName: "David Taylor", agency: "Epsilon Group", bacsReference: "BACS-001298", payDate: "2026-04-20", grossAmount: "£2,100.00", commissionPercent: "15%", commissionAmount: "£315.00", status: "Pending" },
];

export default function Home() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [payDate, setPayDate] = useState<Date | undefined>();
  const [data, setData] = useState<CommissionRow[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

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
    setStartDate(undefined);
    setEndDate(undefined);
    setPayDate(undefined);
    setData([]);
  };

  const allFieldsFilled = Boolean(startDate && endDate && payDate);

  const handleCalc = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const effectivePayDate = payDate ?? endDate ?? new Date();
      const payDateStr = format(effectivePayDate, "yyyy-MM-dd");
      setData(
        SAMPLE_DATA.map((row) => ({ ...row, payDate: payDateStr }))
      );
      setIsCalculating(false);
    }, 600);
  };

  const columns = [
    { key: "adviserName", header: "Adviser Name", sortable: true },
    { key: "agency", header: "Agency / Branch", sortable: true },
    { key: "bacsReference", header: "BACS Ref" },
    { key: "payDate", header: "Pay Date", render: (row: CommissionRow) => format(parseISO(row.payDate), "dd, MMM, yyyy") },
    { key: "grossAmount", header: "Gross (£)" },
    { key: "commissionPercent", header: "Comm %" },
    { key: "commissionAmount", header: "Comm (£)" },
    { 
      key: "status", 
      header: "Status",
      render: (row: CommissionRow) => (
        <span className={`font-semibold ${
          row.status === 'Paid' ? 'text-[#178830]' : 
          row.status === 'Held' ? 'text-[#d72714]' : 'text-[#04589b]'
        }`}>
          {row.status}
        </span>
      )
    },
  ];

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

        {/* Results Grid */}
        {data.length > 0 ? (
          <div className="bg-white rounded-[12px] border border-[#BBBBBB] shadow-sm overflow-hidden flex-1">
            <div className="p-6 border-b border-[#BBBBBB] flex justify-between items-center bg-[#eef4f8]">
              <h3 className="font-['Livvic'] text-[20px] font-semibold text-[#002f5c]">Results</h3>
              <div className="text-[14px] font-['Mulish'] text-[#3d3d3d]">
                Showing {data.length} records
              </div>
            </div>
            <div className="p-6">
              <DataGrid columns={columns} data={data} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[12px] border border-[#BBBBBB] shadow-sm p-12 flex flex-col items-center justify-center text-center flex-1">
            <div className="text-[#BBBBBB] mb-4">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-['Livvic'] text-[20px] font-semibold text-[#002f5c] mb-2">No data generated</h3>
            <p className="font-['Mulish'] text-[16px] text-[#3d3d3d] max-w-[400px]">
              Select your date parameters and click "GO!!" to generate the BACS commission report.
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
