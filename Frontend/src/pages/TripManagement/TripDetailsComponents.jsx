import { FaStar, FaUser, FaCar, FaMoneyBillWave, FaChevronDown, FaChevronUp } from "react-icons/fa";

/* ------------------ InfoCard ------------------ */
import { useState } from "react";

export const InfoCard = ({ title, children, footer }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-violet-700  rounded-2xl p-6 200 transition hover:shadow-lg mb-6">

      {/* Header Row */}
      
      <div className="flex items-center justify-between mb-3" onClick={() => setCollapsed(!collapsed)}>
        <div className="flex items-center" >
             <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
        <button
          
          className="text-sm text-white underline-white hover:text-gray-100 transition"
        >
          {collapsed ? <FaChevronDown/> : <FaChevronUp/>}
        </button>
      </div>

      {/* Divider Under Header */}
      <div className="border-b pb-2 mb-4 border-white"></div>

      {/* Collapsible Body */}
      {!collapsed && (
        <div className="transition-all">
          {children}
        </div>
      )}

      {/* Footer */}
      {!collapsed && footer && (
        <div className="mt-5 border-t pt-3">
          {footer}
        </div>
      )}
    </div>
  );
};

export const InfoCardSub = ({ title, children, footer }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white shadow-sm rounded-2xl p-4 border border-white transition hover:shadow-lg mb-6">

      {/* Header Row */}
      
      <div className="flex items-center justify-between mb-3   p-1 rounded-xl" onClick={() => setCollapsed(!collapsed)}>
        <div className="flex items-center">
              <div className="w-2 h-8 bg-indigo-800 rounded mr-3"></div>
             <h2 className="text-xl font-bold text-indigo-900">{title}</h2>
            </div>
        <button
          className="text-sm text-blue-800 underline hover:text-blue-800 transition"
        >
          {collapsed ? <FaChevronDown/> : <FaChevronUp/>}
        </button>

      </div>

      {/* Divider Under Header */}
      <div className="border-b pb-2 mb-4"></div>

      {/* Collapsible Body */}
      {!collapsed && (
        <div className="transition-all">
          {children}
        </div>
      )}

      {/* Footer */}
      {!collapsed && footer && (
        <div className="mt-5 border-t pt-3">
          {footer}
        </div>
      )}
    </div>
  );
};


/* ------------------ OneColumnRow ------------------ */
export const OneColumnRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-white-50 transition">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="font-semibold text-gray-90text-gray-600 font-medium0">{value ?? "-"}</span>
  </div>
);
export const OneColumnRowSub = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-white-50 transition">
    <span className="text-white font-medium">{label}</span>
    <span className="font-semibold text-gray-90text-gray-600 font-medium0">{value ?? "-"}</span>
  </div>
);

/* ------------------ CustomerDetails ------------------ */
export const CustomerDetails = ({ trip, isBase64 }) => {
  const customer = trip.customer;

  if (!customer)
    return (
      <div className="text-sm font-semibold text-white mt-2">
        No customer data
      </div>
    );

  // Avatar = NIC front image OR fallback circle with initials
  const avatarImg = customer.nic_photo_frontt
    ? (isBase64(customer.nic_photo_frontt)
        ? `data:image/jpeg;base64,${customer.nic_photo_frontt}`
        : customer.nic_photo_front)
    : null;

  // NIC Images
  const nicFront = customer.nic_photo_front
    ? (isBase64(customer.nic_photo_front)
        ? `data:image/jpeg;base64,${customer.nic_photo_front}`
        : customer.nic_photo_front)
    : null;

  const nicBack = customer.nic_photo_back
    ? (isBase64(customer.nic_photo_back)
        ? `data:image/jpeg;base64,${customer.nic_photo_back}`
        : customer.nic_photo_back)
    : null;

  // Fallback initials
  const initials =
    customer.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl  p-4 flex flex-col items-center text-sm">

  {/* Avatar Image */}
  {avatarImg ? (
    <img
      src={avatarImg}
      alt="Customer Avatar"
      className="w-32 h-32 object-cover rounded-full shadow border mb-4"
    />
  ) : (
    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-black shadow mb-4">
      {initials}
    </div>
  )}

  {/* Name */}
  <h3 className="text-lg font-semibold text-white mb-1">
    {customer.name}
  </h3>

  {/* Fields */}
  <div className="w-full flex flex-col gap-2 mt-2 text-white">
    <OneColumnRowSub label="NIC" value={customer.nic} />
    <OneColumnRowSub label="Phone" value={customer.phone_number} />
    <OneColumnRowSub label="Email" value={customer.email} />
  </div>

  {/* NIC Images */}
  <div className="flex gap-3 mt-4 flex-wrap justify-center">
    {nicFront && (
      <div className="flex flex-col items-center">
        <img
          src={nicFront}
          alt="NIC Front"
          className="w-36 h-24 object-cover rounded-lg shadow border-2 border-white"
        />
        <span className="text-xs text-white mt-1">NIC Front</span>
      </div>
    )}

    {nicBack && (
      <div className="flex flex-col items-center">
        <img
          src={nicBack}
          alt="NIC Back"
          className="w-36 h-24 object-cover rounded-lg shadow border-2 border-white"
        />
        <span className="text-xs text-white mt-1">NIC Back</span>
      </div>
    )}
  </div>
</div>

  );
};



/* ------------------ DriverDetails ------------------ */
export const DriverDetails = ({ trip, isBase64 }) => {
  if (!trip.driver)
    return (
      <div className="text-sm font-semibold text-gray-500 mt-2">
        No driver assigned
      </div>
    );

  const driverImg = trip.driver?.image
    ? (isBase64(trip.driver.image)
        ? `data:image/jpeg;base64,${trip.driver.image}`
        : trip.driver.image)
    : null;

  return (
    <div className="bg-gray-100 border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center text-sm">

      {/* Driver Profile Image */}
      {driverImg && (
        <img
          src={driverImg}
          alt="Driver"
          className="w-40 h-40 object-cover rounded-full shadow mb-4 border"
        />
      )}

      {/* Driver Name */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {trip.driver.name}
      </h3>

      {/* Driver Info */}
      <div className="w-full flex flex-col gap-2 mt-2">
        <OneColumnRow label="Phone" value={trip.driver.phone_number} />
        <OneColumnRow label="NIC" value={trip.driver.nic} />
        <OneColumnRow label="Age" value={trip.driver.age} />
        <OneColumnRow label="License No." value={trip.driver.license_number} />
        <OneColumnRow label="Charges" value={`Rs. ${trip.driver.driver_charges}`} />
      </div>
    </div>
  );
};


/* ------------------ VehicleDetails ------------------ */
export const VehicleDetails = ({ trip, isBase64 }) => {
  const vehicle = trip.vehicle;

  if (!vehicle)
    return (
      <div className="text-sm font-semibold text-gray-500 mt-2">
        No vehicle assigned
      </div>
    );

  const vehicleImg = vehicle.image
    ? (isBase64(vehicle.image)
        ? `data:image/jpeg;base64,${vehicle.image}`
        : vehicle.image)
    : null;

  return (
    <div className="bg-gray-100 border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center text-sm">

      {/* Vehicle Image */}
      {vehicleImg && (
        <img
          src={vehicleImg}
          alt="Vehicle"
          className="w-56 h-40 object-cover rounded-xl shadow mb-4 border"
        />
      )}

      {/* Vehicle Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1">
        {vehicle.name}
      </h3>

      {/* Vehicle Details */}
      <div className="w-full flex flex-col gap-2 mt-2">
        <OneColumnRow label="Number" value={vehicle.vehicle_number} />
        <OneColumnRow label="Type" value={vehicle.type} />
        <OneColumnRow label="AC Type" value={vehicle.ac_type} />
        <OneColumnRow
          label="Fuel Efficiency"
          value={
            vehicle.vehicle_fuel_efficiency
              ? `${vehicle.vehicle_fuel_efficiency} km/l`
              : "-"
          }
        />
        <OneColumnRow
          label="License Expiry"
          value={
            vehicle.license_expiry_date
              ? new Date(vehicle.license_expiry_date).toLocaleDateString()
              : "-"
          }
        />
        <OneColumnRow
          label="Insurance Expiry"
          value={
            vehicle.insurance_expiry_date
              ? new Date(vehicle.insurance_expiry_date).toLocaleDateString()
              : "-"
          }
        />
        <OneColumnRow
          label="Last Service Meter"
          value={vehicle.last_service_meter_number}
        />
      </div>
    </div>
  );
};


/* ------------------ CostSummary ------------------ */
export const CostSummary = ({ trip, formatCurrency,formatDate  }) => (
  <InfoCardSub title="Cost Summary">
    <div className="bg-gray-100 p-1 rounded-lg">
    <div className="flex flex-col gap-1 text-gray-600 font-medium">
      {[
        ["Vehicle Rent (Daily)", trip.vehicle_rent_daily],
        ["Driver Cost", trip.driver_cost],
        ["Mileage Extra Cost", trip.additional_mileage_cost],
        ["Mileage Cost (Applied)", trip.mileage_cost],
        ["Discount", trip.discount],
        ["Damage Cost", trip.damage_cost],
      ].map(([label, val], idx) => (
        <OneColumnRow key={idx} label={label} value={formatCurrency(val)} />
      ))}
    </div>
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
    <br></br>
    <h3 className="text-xl font-bold text-gray-800">Payments</h3>
    <div className="border-b pb-2 mb-4"></div>
    <div className="bg-gray-100 p-1 rounded-lg">
    <div className="flex flex-col gap-1 text-gray-600 font-medium">
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

    <div className="mt-5 p-2 bg-gradient-to-r from-indigo-100 to-violet-100 border-l-4 border-indigo-400 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition">
    <div className="flex items-center gap-3">
      <FaStar className="text-indigo-600 text-xl" />
      <div>
        <div className="text-md font-bold text-indigo-800">Estimated Cost</div>
      </div>
    </div>
    <div className="text-xl font-bold text-indigo-900">{formatCurrency(trip.total_estimated_cost)}</div>
    </div>
    <div className="mt-5 p-2 bg-gradient-to-r from-indigo-200 to-violet-200 border-l-4 border-indigo-600 rounded-xl flex items-center justify-between shadow-md hover:shadow-lg transition">
      <div className="flex items-center gap-3">
        <FaStar className="text-indigo-700 text-xl" />
        <div>
          <div className="text-md font-bold text-indigo-800">Total Actual Cost</div>
        </div>
      </div>
      <div className="text-xl font-bold text-indigo-900">{formatCurrency(trip.total_actual_cost)}</div>
    </div>
  </InfoCardSub>
);

/* ------------------ Payments ------------------ */
export const Payments = ({ trip, formatCurrency, formatDate }) => (
  <InfoCard title="Payments">
    <div className="flex flex-col gap-2 text-gray-600 font-medium">
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
