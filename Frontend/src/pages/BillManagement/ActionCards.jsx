import { PlusCircle, FileText } from "lucide-react";

export default function BillActionCards({ onAddBillClick }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      
      {/* Add Bill Card */}
      <div className="bg-white p-5 rounded-xl shadow flex flex-col justify-between h-full ml-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50">
            <PlusCircle
              onClick={onAddBillClick}
              className="text-blue-600 cursor-pointer"
            />
          </div>
          <div className="font-semibold">Add New Bill</div>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Upload a new bill to the system.
        </p>
      </div>

      {/* View All Bills */}
      
    </div>
  );
}
