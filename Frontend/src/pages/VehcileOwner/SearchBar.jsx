import { useState } from "react";
import { Search } from "lucide-react";

export default function OwnerSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleInput = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // send search text to parent
  };

  return (
    <div className="w-full mb-4 outline-none">
      <div className="flex items-center bg-white p-3 rounded-lg  shadow flex">
        <Search className="text-gray-400 mr-3 " />
        <input
          type="text"
          placeholder="Search Owmer by name, phone..."
          value={query}
          onChange={handleInput}
          className="w-full outline-none text-sm "
        />
      </div>
    </div>
  );
}
