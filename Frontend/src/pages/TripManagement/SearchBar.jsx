import { useState } from "react";
import { Search } from "lucide-react";

export default function TripSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleInput = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // send search text to parent
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-center bg-white p-3 rounded-xl shadow border border-gray-200">
        <Search className="text-gray-400 mr-3" size={20} />
        <input
          type="text"
          placeholder="Search trips by From, To, Customer, Vehicle, Driver..."
          value={query}
          onChange={handleInput}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>
    </div>
  );
}
