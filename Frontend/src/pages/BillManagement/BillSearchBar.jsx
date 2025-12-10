import { useState } from "react";
import { Search } from "lucide-react";

export default function BillSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleInput = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-center bg-white p-3 rounded-lg shadow">
        <Search className="text-gray-400 mr-3" size={18} />
        <input
          type="text"
          placeholder="Search by vehicle ID, driver ID, or bill type..."
          value={query}
          onChange={handleInput}
          className="w-full outline-none text-sm"
        />
      </div>
    </div>
  );
}
