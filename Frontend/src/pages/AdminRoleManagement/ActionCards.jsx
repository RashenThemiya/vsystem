// ActionCards.jsx
import { useNavigate } from "react-router-dom";
import { PlusCircle, Users, FileText } from "lucide-react";

export default function ActionCards({ onAddAdminClick }) {
  const nav = useNavigate();
  return (
    <div className="flex flex-col gap-4 h-full cursor-pointer" onClick={onAddAdminClick}>

      <div className="bg-white p-5 rounded-xl shadow flex flex-col justify-between h-full">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50">
            <PlusCircle className="text-blue-600" />
          </div>
          <div className="font-semibold">Add New Admin Role</div>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Register a new Admin Role to the system.
        </p>
      </div>

    

      {/*<div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-green-50"><Users className="text-green-600" /></div>
          <div>
            <div className="text-sm text-gray-500">View</div>
            <div className="font-semibold">View All Customers</div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3">View and manage registered customers.</p>
        <div className="mt-4">
          <button
            onClick={() => nav("/view-customers")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            View Customers
          </button>
        </div>
      </div>*/}
    </div>
  );
}
