import { FaStar, FaUser, FaCar, FaMoneyBillWave } from "react-icons/fa";

/* ------------------ InfoCard ------------------ */
export const InfoCard = ({ title, children, footer }) => (
  <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 transition hover:shadow-lg mb-6">
    <h2 className="text-xl font-bold mb-5 text-gray-800 border-b pb-2">{title}</h2>
    {children}
    {footer && <div className="mt-5 border-t pt-3">{footer}</div>}
  </div>
);

/* ------------------ OneColumnRow ------------------ */
export const OneColumnRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="font-semibold text-gray-900">{value ?? "-"}</span>
  </div>
);

/* ------------------ CustomerDetails ------------------ */
export const CustomerDetails = ({ trip, isBase64 }) => (
  <div className="flex flex-col gap-3 text-sm mt-2">
    <OneColumnRow label="Name" value={trip.customer?.name} />
    <OneColumnRow label="NIC" value={trip.customer?.nic} />
    <OneColumnRow label="Phone" value={trip.customer?.phone_number} />
    <OneColumnRow label="Email" value={trip.customer?.email} />

    <div className="flex gap-3 mt-3 flex-wrap">
      {trip.customer?.nic_photo_front && (
        <img
          src={isBase64(trip.customer.nic_photo_front) ? `data:image/jpeg;base64,${trip.customer.nic_photo_front}` : trip.customer.nic_photo_front}
          alt="NIC Front"
          className="w-36 h-24 object-cover rounded-lg border shadow-sm hover:scale-105 transition"
        />
      )}
      {trip.customer?.nic_photo_back && (
        <img
          src={isBase64(trip.customer.nic_photo_back) ? `data:image/jpeg;base64,${trip.customer.nic_photo_back}` : trip.customer.nic_photo_back}
          alt="NIC Back"
          className="w-36 h-24 object-cover rounded-lg border shadow-sm hover:scale-105 transition"
        />
      )}
    </div>
  </div>
);

/* ------------------ DriverDetails ------------------ */
export const DriverDetails = ({ trip, isBase64 }) => {
  if (!trip.driver) return <div className="text-sm text-gray-500 mt-2">No driver assigned</div>;

  return (
    <div className="flex flex-col gap-3 text-sm mt-2">
      <OneColumnRow label="Name" value={trip.driver.name} />
      <OneColumnRow label="Phone" value={trip.driver.phone_number} />
      <OneColumnRow label="NIC" value={trip.driver.nic} />
      <OneColumnRow label="Age" value={trip.driver.age} />
      <OneColumnRow label="License No." value={trip.driver.license_number} />
      <OneColumnRow label="Charges" value={`Rs. ${trip.driver.driver_charges}`} />

      {trip.driver.image && (
        <img
          src={isBase64(trip.driver.image) ? `data:image/jpeg;base64,${trip.driver.image}` : trip.driver.image}
          alt="Driver"
          className="w-40 h-40 object-cover rounded-lg border shadow-sm hover:scale-105 transition"
        />
      )}
    </div>
  );
};

/* ------------------ VehicleDetails ------------------ */
export const VehicleDetails = ({ trip, isBase64 }) => (
  <div className="flex flex-col gap-3 text-sm mt-2">
    <OneColumnRow label="Name" value={trip.vehicle?.name} />
    <OneColumnRow label="Number" value={trip.vehicle?.vehicle_number} />
    <OneColumnRow label="Type" value={trip.vehicle?.type} />
    <OneColumnRow label="AC Type" value={trip.vehicle?.ac_type} />
    <OneColumnRow label="Fuel Efficiency" value={trip.vehicle?.vehicle_fuel_efficiency ? trip.vehicle.vehicle_fuel_efficiency + " km/l" : "-"} />
    <OneColumnRow label="License Expiry" value={trip.vehicle?.license_expiry_date ? new Date(trip.vehicle.license_expiry_date).toLocaleDateString() : "-"} />
    <OneColumnRow label="Insurance Expiry" value={trip.vehicle?.insurance_expiry_date ? new Date(trip.vehicle.insurance_expiry_date).toLocaleDateString() : "-"} />
    <OneColumnRow label="Last Service Meter" value={trip.vehicle?.last_service_meter_number} />

    {trip.vehicle?.image && (
      <img
        src={isBase64(trip.vehicle.image) ? `data:image/jpeg;base64,${trip.vehicle.image}` : trip.vehicle.image}
        alt="Vehicle"
        className="w-52 h-36 object-cover rounded-lg border shadow-sm hover:scale-105 transition"
      />
    )}
  </div>
);

/* ------------------ CostSummary ------------------ */
export const CostSummary = ({ trip, formatCurrency }) => (
  <InfoCard title="Cost Summary">
    <div className="flex flex-col gap-2 text-sm">
      {[
        ["Vehicle Rent (Daily)", trip.vehicle_rent_daily],
        ["Driver Cost", trip.driver_cost],
        ["Fuel Cost", trip.fuel_cost],
        ["Mileage Extra Cost", trip.additional_mileage_cost],
        ["Mileage Cost (Applied)", trip.mileage_cost],
        ["Discount", trip.discount],
        ["Damage Cost", trip.damage_cost],
        ["Estimated Cost", trip.total_estimated_cost],
      ].map(([label, val], idx) => (
        <OneColumnRow key={idx} label={label} value={formatCurrency(val)} />
      ))}
    </div>

    <div className="mt-5 p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-400 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition">
      <div className="flex items-center gap-3">
        <FaStar className="text-yellow-600 text-xl" />
        <div>
          <div className="text-xs text-yellow-700 font-semibold">HIGHLIGHT</div>
          <div className="text-lg font-bold text-yellow-800">Total Actual Cost</div>
        </div>
      </div>
      <div className="text-xl font-extrabold text-yellow-900">{formatCurrency(trip.total_actual_cost)}</div>
    </div>

    {trip.other_trip_costs?.length > 0 && (
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Other Trip Costs</h3>
        <ul className="text-sm list-disc ml-5 space-y-1">
          {trip.other_trip_costs.map((c) => (
            <li key={c.trip_other_cost_id}>
              {c.cost_type}: <span className="font-medium">{formatCurrency(c.cost_amount)}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </InfoCard>
);

/* ------------------ Payments ------------------ */
export const Payments = ({ trip, formatCurrency, formatDate }) => (
  <InfoCard title="Payments">
    <div className="flex flex-col gap-2 text-sm">
      <OneColumnRow label="Advance Payment" value={formatCurrency(trip.advance_payment)} />
      <OneColumnRow label="Payment Amount" value={formatCurrency(trip.payment_amount)} />
      <OneColumnRow
        label="Payment Status"
        value={
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              trip.payment_status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {trip.payment_status}
          </span>
        }
      />
    </div>

    {trip.payments?.length > 0 && (
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">All Payments</h4>
        <ul className="text-sm list-disc ml-5 space-y-1">
          {trip.payments.map((p) => (
            <li key={p.payment_id}>
              <span className="font-medium">{formatCurrency(p.amount)}</span>{" "}
              <span className="text-gray-500 text-xs">({formatDate(p.payment_date)})</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </InfoCard>
);
