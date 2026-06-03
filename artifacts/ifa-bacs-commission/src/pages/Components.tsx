import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Combobox } from "@/components/ui/combobox";
import { CounterInput } from "@/components/ui/counter-input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataGrid } from "@/components/ui/data-grid";
import { EditableDataGrid } from "@/components/ui/editable-data-grid";
import { MdSearch, MdInfoOutline } from "react-icons/md";

export default function Components() {
  const [date, setDate] = useState<Date>();
  const [comboValue, setComboValue] = useState<string>("");
  const [counterValue, setCounterValue] = useState<number>(100);

  const comboOptions = [
    { label: "Alpha Financial", value: "alpha" },
    { label: "Beta Wealth", value: "beta" },
    { label: "Gamma Advisors", value: "gamma" },
  ];

  const gridData = [
    { id: 1, name: "John Smith", amount: "£1,200", status: "Active" },
    { id: 2, name: "Sarah Jones", amount: "£3,450", status: "Pending" },
  ];

  const [editableGridData, setEditableGridData] = useState([
    { id: 1, name: "Option A", isRadio: true, isCheck: false, percent: "15" },
    { id: 2, name: "Option B", isRadio: false, isCheck: true, percent: "20" },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0]">
      <Header />
      
      <main className="flex-1 px-[142px] py-8 pb-24 flex flex-col gap-12 max-w-[1200px] mx-auto w-full">
        
        {/* Buttons */}
        <section>
          <h2 className="font-['Livvic'] text-[24px] font-semibold text-[#002f5c] mb-6 border-b border-[#BBBBBB] pb-2">Buttons</h2>
          <div className="flex flex-wrap gap-4 items-end bg-white p-6 rounded-[12px] border border-[#BBBBBB]">
            <Button>Default Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <div className="bg-[#00263e] p-4 rounded-md">
              <Button variant="ghost">Ghost on Dark</Button>
            </div>
            <Button variant="link">Link Style</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="font-['Livvic'] text-[24px] font-semibold text-[#002f5c] mb-6 border-b border-[#BBBBBB] pb-2">Inputs & Controls</h2>
          <div className="grid grid-cols-2 gap-8 bg-white p-6 rounded-[12px] border border-[#BBBBBB]">
            
            <div className="space-y-4">
              <div>
                <label className="block font-['Livvic'] text-[14px] font-medium mb-1">Standard Input</label>
                <Input placeholder="Enter text..." />
              </div>
              <div>
                <label className="block font-['Livvic'] text-[14px] font-medium mb-1">With Suffix Icon</label>
                <Input placeholder="Search..." suffixIcon={<MdSearch />} />
              </div>
              <div>
                <label className="block font-['Livvic'] text-[14px] font-medium mb-1 text-[#d72714]">Error State</label>
                <Input placeholder="Invalid input" error suffixIcon={<MdInfoOutline />} />
              </div>
              <div>
                <label className="block font-['Livvic'] text-[14px] font-medium mb-1">Disabled State</label>
                <Input placeholder="Not allowed" disabled suffixIcon={<MdSearch />} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-['Livvic'] text-[14px] font-medium mb-1">Date Picker</label>
                <DatePicker date={date} onSelect={setDate} />
              </div>
              <div>
                <label className="block font-['Livvic'] text-[14px] font-medium mb-1">Combobox</label>
                <Combobox options={comboOptions} value={comboValue} onChange={setComboValue} />
              </div>
              <div>
                <label className="block font-['Livvic'] text-[14px] font-medium mb-1">Counter Input</label>
                <CounterInput value={counterValue} onChange={setCounterValue} />
              </div>
            </div>

          </div>
        </section>

        {/* Tabs */}
        <section>
          <h2 className="font-['Livvic'] text-[24px] font-semibold text-[#002f5c] mb-6 border-b border-[#BBBBBB] pb-2">Tabs</h2>
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList>
              <TabsTrigger value="tab1">Details</TabsTrigger>
              <TabsTrigger value="tab2">Transactions</TabsTrigger>
              <TabsTrigger value="tab3">History</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="bg-white p-6 rounded-[12px] border border-[#BBBBBB] rounded-tl-none min-h-[150px]">
              Tab 1 Content
            </TabsContent>
            <TabsContent value="tab2" className="bg-white p-6 rounded-[12px] border border-[#BBBBBB] min-h-[150px]">
              Tab 2 Content
            </TabsContent>
            <TabsContent value="tab3" className="bg-white p-6 rounded-[12px] border border-[#BBBBBB] min-h-[150px]">
              Tab 3 Content
            </TabsContent>
          </Tabs>
        </section>

        {/* Data Grids */}
        <section>
          <h2 className="font-['Livvic'] text-[24px] font-semibold text-[#002f5c] mb-6 border-b border-[#BBBBBB] pb-2">Data Grids</h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-[12px] border border-[#BBBBBB]">
              <h3 className="font-['Livvic'] text-[18px] font-semibold mb-4">Read-only Data Grid</h3>
              <DataGrid 
                columns={[
                  { key: "name", header: "Name", sortable: true },
                  { key: "amount", header: "Amount", sortable: true },
                  { key: "status", header: "Status" }
                ]} 
                data={gridData} 
              />
            </div>

            <div className="bg-white p-6 rounded-[12px] border border-[#BBBBBB]">
              <h3 className="font-['Livvic'] text-[18px] font-semibold mb-4">Editable Data Grid</h3>
              <EditableDataGrid 
                columns={[
                  { key: "name", header: "Name" },
                  { key: "isRadio", header: "Select", editableType: "radio", onEdit: (id, val) => setEditableGridData(d => d.map(r => r.id === id ? {...r, isRadio: val} : r)) },
                  { key: "isCheck", header: "Include", editableType: "checkbox", onEdit: (id, val) => setEditableGridData(d => d.map(r => r.id === id ? {...r, isCheck: val} : r)) },
                  { key: "percent", header: "Allocation", editableType: "percentage", onEdit: (id, val) => setEditableGridData(d => d.map(r => r.id === id ? {...r, percent: val} : r)) },
                  { key: "action", header: "", render: () => <Button size="sm" className="h-[40px]">Action</Button> }
                ]} 
                data={editableGridData} 
              />
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
