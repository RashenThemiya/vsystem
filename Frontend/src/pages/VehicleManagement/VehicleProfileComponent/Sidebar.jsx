const Sidebar = ({ vehicle, openImage }) => {
  const documents = [
    { label: "Vehicle", src: vehicle.image },
    { label: "License", src: vehicle.license_image },
    { label: "Insurance", src: vehicle.insurance_card_image },
    { label: "Eco Test", src: vehicle.eco_test_image },
    { label: "Book", src: vehicle.book_image },
  ];

  return (
    <div className="w-72 bg-white shadow-lg rounded-xl p-4 flex flex-col items-center gap-4 overflow-y-auto sticky top-0 h-screen">
      <img
        src={vehicle.image}
        alt={vehicle.name}
        className="w-32 h-32 rounded-full border-2 border-purple-600 object-cover shadow-md"
      />
      <h2 className="text-xl font-bold text-purple-700 text-center">{vehicle.name}</h2>

      <div className="text-sm text-gray-700 space-y-1 w-full">
        <p><strong>Number:</strong> {vehicle.vehicle_number}</p>
        <p><strong>Type:</strong> {vehicle.type}</p>
        <p><strong>Daily Rent:</strong> Rs. {vehicle.rent_cost_daily}</p>
        <p><strong>AC:</strong> {vehicle.ac_type}</p>
        <p><strong>Owner Cost/Month:</strong> Rs. {vehicle.owner_cost_monthly}</p>
        <p><strong>Fuel:</strong> {vehicle.fuel?.type} (Rs. {vehicle.fuel?.cost})</p>
        <p><strong>Efficiency:</strong> {vehicle.vehicle_fuel_efficiency} km/L</p>
        <p><strong>Meter:</strong> {vehicle.meter_number} km</p>
        <p><strong>Last Service:</strong> {vehicle.last_service_meter_number} km</p>
        <p><strong>Availability:</strong> {vehicle.vehicle_availability}</p>
        <p><strong>Owner:</strong> {vehicle.owner?.owner_name}</p>
        <p><strong>Mileage Cost:</strong> Rs. {vehicle.mileage_costs?.[0]?.mileage_cost}</p>
        <p><strong>Additional Mileage:</strong> Rs. {vehicle.mileage_costs?.[0]?.mileage_cost_additional}</p>
        <p><strong>License Expiry:</strong> {vehicle.license_expiry_date?.split("T")[0]}</p>
        <p><strong>Insurance Expiry:</strong> {vehicle.insurance_expiry_date?.split("T")[0]}</p>
        <p><strong>ECO Test Expiry:</strong> {vehicle.eco_test_expiry_date?.split("T")[0]}</p>
      </div>

      <div className="w-full mt-4">
        <h3 className="text-sm font-bold text-gray-800 mb-2 text-center">Documents</h3>
        <div className="grid grid-cols-3 gap-2">
          {documents
            .filter((doc) => doc.src)
            .map((doc) => (
              <div
                key={doc.label}
                className="flex flex-col items-center border rounded-sm overflow-hidden shadow hover:shadow-md cursor-pointer p-1"
                onClick={() => openImage(doc.src)}
              >
                <img src={doc.src} alt={doc.label} className="w-14 h-14 object-cover rounded" />
                <span className="text-xs font-semibold mt-1">{doc.label}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
